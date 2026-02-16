<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DollSettingsController extends Controller
{
    public function getSettings()
    {
        try {
            $settings = DB::table('doll_settings')->where('key', 'default_config')->value('value');
            return $settings ? json_decode($settings, true) : [];
        } catch (\Exception $e) {
            Log::error('Failed to get doll settings from DB: '.$e->getMessage());
            return [];
        }
    }

    public function saveSettings(Request $request)
    {
        try {
            $data = $request->input('settings', []);
            
            DB::table('doll_settings')->updateOrInsert(
                ['key' => 'default_config'],
                ['value' => json_encode($data), 'updated_at' => now()]
            );

            return response()->json(['success' => true, 'message' => 'Settings saved successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to save doll settings to DB: '.$e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to save settings'], 500);
        }
    }

    public function getAllPartPositions()
    {
        try {
            $positions = DB::table('doll_part_positions')->get();
            
            $formatted = [];
            foreach ($positions as $pos) {
                // Key format: view|category|part_id
                $key = "{$pos->view}|{$pos->category}|{$pos->part_id}";
                $formatted[$key] = [
                    'x' => $pos->x,
                    'y' => $pos->y,
                    'scale' => $pos->scale
                ];
            }
            return $formatted;
        } catch (\Exception $e) {
            Log::error('Failed to get part positions: '.$e->getMessage());
            return [];
        }
    }

    public function getPartPositions()
    {
        return response()->json($this->getAllPartPositions());
    }

    public function savePartPosition(Request $request)
    {
        try {
            $validated = $request->validate([
                'part_id' => 'required|string',
                'category' => 'required|string',
                'view' => 'required|string|in:front,back',
                'x' => 'required|numeric',
                'y' => 'required|numeric',
                'scale' => 'required|numeric',
            ]);

            DB::table('doll_part_positions')->updateOrInsert(
                [
                    'part_id' => $validated['part_id'],
                    'category' => $validated['category'],
                    'view' => $validated['view']
                ],
                [
                    'x' => $validated['x'],
                    'y' => $validated['y'],
                    'scale' => $validated['scale'],
                    'updated_at' => now()
                ]
            );

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to save part position: '.$e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
