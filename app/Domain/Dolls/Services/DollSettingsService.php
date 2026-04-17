<?php

namespace App\Domain\Dolls\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DollSettingsService
{
    public function getSettings(): array
    {
        try {
            $settings = DB::table('doll_settings')
                ->where('key', 'default_config')
                ->value('value');

            return $settings ? json_decode($settings, true) : [];
        } catch (\Exception $e) {
            Log::error('Failed to get doll settings from DB: '.$e->getMessage());

            return [];
        }
    }

    public function saveSettings(array $settings): bool
    {
        try {
            DB::table('doll_settings')->updateOrInsert(
                ['key' => 'default_config'],
                ['value' => json_encode($settings), 'updated_at' => now()]
            );

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to save doll settings to DB: '.$e->getMessage());

            return false;
        }
    }

    public function getAllPartPositions(): array
    {
        try {
            $positions = DB::table('doll_part_positions')->get();
            $formatted = [];

            foreach ($positions as $position) {
                $key = "{$position->view}|{$position->category}|{$position->part_id}";
                $formatted[$key] = [
                    'x' => $position->x,
                    'y' => $position->y,
                    'scale' => $position->scale,
                ];
            }

            return $formatted;
        } catch (\Exception $e) {
            Log::error('Failed to get part positions: '.$e->getMessage());

            return [];
        }
    }

    public function savePartPosition(array $position): bool
    {
        try {
            DB::table('doll_part_positions')->updateOrInsert(
                [
                    'part_id' => $position['part_id'],
                    'category' => $position['category'],
                    'view' => $position['view'],
                ],
                [
                    'x' => $position['x'],
                    'y' => $position['y'],
                    'scale' => $position['scale'],
                    'updated_at' => now(),
                ]
            );

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to save part position: '.$e->getMessage());

            return false;
        }
    }
}
