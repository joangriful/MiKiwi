<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DollSettingsController extends Controller
{
    private $settingsFile = 'doll_defaults.json';

    public function getSettings()
    {
        if (Storage::disk('local')->exists($this->settingsFile)) {
            return json_decode(Storage::disk('local')->get($this->settingsFile), true);
        }
        return [];
    }

    public function saveSettings(Request $request)
    {
        try {
            $data = $request->input('settings', []);
            // Validate structure if needed, but for now just save the JSON
            Storage::disk('local')->put($this->settingsFile, json_encode($data, JSON_PRETTY_PRINT));
            
            return response()->json(['success' => true, 'message' => 'Settings saved successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to save doll settings: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to save settings'], 500);
        }
    }
}
