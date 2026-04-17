<?php

namespace App\Http\Controllers;

use App\Domain\Dolls\Services\DollSettingsService;
use Illuminate\Http\Request;

class DollSettingsController extends Controller
{
    public function __construct(
        private readonly DollSettingsService $dollSettingsService,
    ) {
    }

    public function getSettings()
    {
        return $this->dollSettingsService->getSettings();
    }

    public function saveSettings(Request $request)
    {
        if ($this->dollSettingsService->saveSettings($request->input('settings', []))) {
            return response()->json(['success' => true, 'message' => 'Settings saved successfully']);
        }

        return response()->json(['success' => false, 'message' => 'Failed to save settings'], 500);
    }

    public function getAllPartPositions()
    {
        return $this->dollSettingsService->getAllPartPositions();
    }

    public function getPartPositions()
    {
        return response()->json($this->getAllPartPositions());
    }

    public function savePartPosition(Request $request)
    {
        $validated = $request->validate([
            'part_id' => 'required|string',
            'category' => 'required|string',
            'view' => 'required|string|in:front,back',
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'scale' => 'required|numeric',
        ]);

        if ($this->dollSettingsService->savePartPosition($validated)) {
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Failed to save part position'], 500);
    }
}
