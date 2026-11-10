/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, CropInfo, SoilReading, SoilTestRecord } from './types/soil';
import { CROPS_CATALOG, DEFAULT_PROTOTYPE_READINGS, generateFertilizerRecommendation } from './utils/agronomy';
import {
  loadDeviceSettings,
  saveDeviceSettings,
  loadSavedRecords,
  saveSoilRecord,
  createNewRecord,
  DeviceSettings,
} from './utils/storage';
import { StoryboardHeader } from './components/StoryboardHeader';
import { DeviceStatusBar } from './components/DeviceStatusBar';
import { Screen01Welcome } from './components/Screen01Welcome';
import { Screen02Dashboard } from './components/Screen02Dashboard';
import { Screen03CropSelect } from './components/Screen03CropSelect';
import { Screen04SensorPrep } from './components/Screen04SensorPrep';
import { Screen05Measurement } from './components/Screen05Measurement';
import { Screen06Results } from './components/Screen06Results';
import { Screen07Fertilizer } from './components/Screen07Fertilizer';
import { Screen08Completion } from './components/Screen08Completion';
import { ApplicationGuideModal } from './components/ApplicationGuideModal';
import { FullReportModal } from './components/FullReportModal';
import { PreviousResultsModal } from './components/PreviousResultsModal';
import { DeviceStatusModal } from './components/DeviceStatusModal';
import { SettingsModal } from './components/SettingsModal';
import { playSound } from './utils/audio';

export default function App() {
  // Screen state (Screen 01 to 08)
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');

  // Device & Agronomy state
  const [settings, setSettings] = useState<DeviceSettings>(loadDeviceSettings);
  const [records, setRecords] = useState<SoilTestRecord[]>(loadSavedRecords);
  const [selectedCrop, setSelectedCrop] = useState<CropInfo>(() => {
    return CROPS_CATALOG.find((c) => c.id === 'maize') || CROPS_CATALOG[0];
  });
  const [currentReadings, setCurrentReadings] = useState<SoilReading>(DEFAULT_PROTOTYPE_READINGS);
  const [activeRecord, setActiveRecord] = useState<SoilTestRecord>(() => {
    const initialCrop = CROPS_CATALOG.find((c) => c.id === 'maize') || CROPS_CATALOG[0];
    return createNewRecord(initialCrop, DEFAULT_PROTOTYPE_READINGS, settings);
  });

  // Presentation view modes
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    'application_guide' | 'full_report' | 'previous_results' | 'device_status' | 'settings' | null
  >(null);

  // Save settings on update
  const handleUpdateSettings = (newSettings: DeviceSettings) => {
    setSettings(newSettings);
    saveDeviceSettings(newSettings);

    // If switched to online, auto-sync pending records!
    if (newSettings.isOnline && !settings.isOnline) {
      const updated = records.map((r) => ({ ...r, syncStatus: 'synced' as const }));
      setRecords(updated);
      localStorage.setItem('smart_soil_records_v1', JSON.stringify(updated));
    }
  };

  // Synchronization trigger
  const handleTriggerSync = () => {
    const updated = records.map((r) => ({ ...r, syncStatus: 'synced' as const }));
    setRecords(updated);
    localStorage.setItem('smart_soil_records_v1', JSON.stringify(updated));
    if (activeRecord) {
      setActiveRecord({ ...activeRecord, syncStatus: 'synced' });
    }
  };

  // Screen Navigation Handlers
  const handleStartAnalysis = () => {
    setCurrentScreen('dashboard');
  };

  const handleNewSoilTest = () => {
    setCurrentScreen('crop_select');
  };

  const handleCropSelected = (crop: CropInfo) => {
    setSelectedCrop(crop);
  };

  const handleContinueFromCrop = () => {
    setCurrentScreen('sensor_prep');
  };

  const handleStartMeasurement = () => {
    setCurrentScreen('measurement');
  };

  const handleMeasurementComplete = (readings: SoilReading) => {
    setCurrentReadings(readings);
    const rec = createNewRecord(selectedCrop, readings, settings);
    setActiveRecord(rec);
    setCurrentScreen('results');
  };

  const handleGetFertilizerAdvice = () => {
    setCurrentScreen('fertilizer');
  };

  const handleRetestSoil = () => {
    setCurrentScreen('sensor_prep');
  };

  const handleSaveRecommendation = () => {
    const rec = createNewRecord(selectedCrop, currentReadings, settings);
    setActiveRecord(rec);
    saveSoilRecord(rec);
    setRecords(loadSavedRecords());
    setCurrentScreen('completion');
  };

  const handleGoHome = () => {
    setCurrentScreen('dashboard');
  };

  // Screen Header Status mapping
  const getScreenStatusLabel = (): string => {
    switch (currentScreen) {
      case 'welcome':
        return 'Device Ready';
      case 'dashboard':
        return 'All Sensors Ready';
      case 'crop_select':
        return 'Profile Config';
      case 'sensor_prep':
        return 'Waiting for Connection';
      case 'measurement':
        return 'Sampling Soil Telemetry';
      case 'results':
        return 'Analysis Complete';
      case 'fertilizer':
        return 'AI Recommendation Ready';
      case 'completion':
        return 'Record Saved Locally';
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Storyboard Navigation Header & Screen Selector */}
      <StoryboardHeader
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        isDeviceFrame={isDeviceFrame}
        onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
        soundEnabled={settings.soundEnabled}
      />

      {/* Main Container Area */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        {isDeviceFrame ? (
          /* Handheld Rugged Analyzer Enclosure */
          <div className="w-full max-w-4xl mx-auto">
            {/* Physical Rugged Casing Bezel */}
            <div className="relative rounded-3xl bg-stone-900 border-4 border-amber-500/80 p-2 sm:p-3 shadow-2xl shadow-black ring-1 ring-amber-400/30">
              {/* Outer Shock-Resistant Rubber Corners */}
              <div className="absolute -top-2 -left-2 w-7 h-7 bg-amber-500 rounded-lg shadow-sm" />
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 rounded-lg shadow-sm" />
              <div className="absolute -bottom-2 -left-2 w-7 h-7 bg-amber-500 rounded-lg shadow-sm" />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-amber-500 rounded-lg shadow-sm" />

              {/* Device Physical Top Bar with Logo & Screws */}
              <div className="flex items-center justify-between px-4 py-1.5 text-[10px] font-mono text-stone-400 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-stone-700 border border-stone-600" />
                  <span className="font-bold text-amber-400 tracking-wider">
                    SMART SOIL FIELD ANALYZER 500
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-stone-300">IP67 RUGGED HANDHELD</span>
                  <div className="w-2 h-2 rounded-full bg-stone-700 border border-stone-600" />
                </div>
              </div>

              {/* Inner High-Contrast Touchscreen Display */}
              <div className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 flex flex-col min-h-[580px] shadow-inner">
                {/* On-Screen Hardware Status Bar */}
                <DeviceStatusBar
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  statusLabel={getScreenStatusLabel()}
                />

                {/* Active Screen View */}
                <div className="flex-1 flex flex-col">
                  {currentScreen === 'welcome' && (
                    <Screen01Welcome
                      settings={settings}
                      onStartAnalysis={handleStartAnalysis}
                      onOpenSettings={() => setActiveModal('settings')}
                    />
                  )}

                  {currentScreen === 'dashboard' && (
                    <Screen02Dashboard
                      settings={settings}
                      records={records}
                      selectedCrop={selectedCrop}
                      onNewSoilTest={handleNewSoilTest}
                      onOpenPreviousResults={() => setActiveModal('previous_results')}
                      onOpenCropSelection={() => setCurrentScreen('crop_select')}
                      onOpenDeviceStatus={() => setActiveModal('device_status')}
                    />
                  )}

                  {currentScreen === 'crop_select' && (
                    <Screen03CropSelect
                      selectedCrop={selectedCrop}
                      onSelectCrop={handleCropSelected}
                      onContinue={handleContinueFromCrop}
                      onBack={() => setCurrentScreen('dashboard')}
                      soundEnabled={settings.soundEnabled}
                    />
                  )}

                  {currentScreen === 'sensor_prep' && (
                    <Screen04SensorPrep
                      selectedCrop={selectedCrop}
                      onStartMeasurement={handleStartMeasurement}
                      onBack={() => setCurrentScreen('crop_select')}
                      soundEnabled={settings.soundEnabled}
                      samplingDepthCm={settings.samplingDepthCm}
                    />
                  )}

                  {currentScreen === 'measurement' && (
                    <Screen05Measurement
                      selectedCrop={selectedCrop}
                      onComplete={handleMeasurementComplete}
                      onCancel={() => setCurrentScreen('sensor_prep')}
                      soundEnabled={settings.soundEnabled}
                    />
                  )}

                  {currentScreen === 'results' && (
                    <Screen06Results
                      selectedCrop={selectedCrop}
                      readings={currentReadings}
                      onGetFertilizerAdvice={handleGetFertilizerAdvice}
                      onRetestSoil={handleRetestSoil}
                      onBack={() => setCurrentScreen('measurement')}
                      soundEnabled={settings.soundEnabled}
                    />
                  )}

                  {currentScreen === 'fertilizer' && (
                    <Screen07Fertilizer
                      selectedCrop={selectedCrop}
                      readings={currentReadings}
                      recommendation={activeRecord.recommendation}
                      onViewApplicationGuide={() => setActiveModal('application_guide')}
                      onSaveRecommendation={handleSaveRecommendation}
                      onBack={() => setCurrentScreen('results')}
                      soundEnabled={settings.soundEnabled}
                    />
                  )}

                  {currentScreen === 'completion' && (
                    <Screen08Completion
                      record={activeRecord}
                      settings={settings}
                      onViewFullReport={() => setActiveModal('full_report')}
                      onNewSoilTest={handleNewSoilTest}
                      onGoHome={handleGoHome}
                      onTriggerSync={handleTriggerSync}
                      soundEnabled={settings.soundEnabled}
                    />
                  )}
                </div>
              </div>

              {/* Physical Bottom Hardware Grip & Navigation Keys */}
              <div className="flex items-center justify-between px-4 pt-2.5 pb-1 text-stone-500 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 font-bold">
                    F1
                  </div>
                  <span>MENU</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-16 h-1.5 bg-stone-700 rounded-full"></span>
                  <span className="text-stone-400">TOUCHSCREEN ENABLED</span>
                  <span className="w-16 h-1.5 bg-stone-700 rounded-full"></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>ENTER</span>
                  <div className="w-6 h-6 rounded-md bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 font-bold">
                    ↵
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Full Screen Tablet / Kiosk Monitor View */
          <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl flex flex-col min-h-[620px]">
            <DeviceStatusBar
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              statusLabel={getScreenStatusLabel()}
            />

            <div className="flex-1 flex flex-col">
              {currentScreen === 'welcome' && (
                <Screen01Welcome
                  settings={settings}
                  onStartAnalysis={handleStartAnalysis}
                  onOpenSettings={() => setActiveModal('settings')}
                />
              )}

              {currentScreen === 'dashboard' && (
                <Screen02Dashboard
                  settings={settings}
                  records={records}
                  selectedCrop={selectedCrop}
                  onNewSoilTest={handleNewSoilTest}
                  onOpenPreviousResults={() => setActiveModal('previous_results')}
                  onOpenCropSelection={() => setCurrentScreen('crop_select')}
                  onOpenDeviceStatus={() => setActiveModal('device_status')}
                />
              )}

              {currentScreen === 'crop_select' && (
                <Screen03CropSelect
                  selectedCrop={selectedCrop}
                  onSelectCrop={handleCropSelected}
                  onContinue={handleContinueFromCrop}
                  onBack={() => setCurrentScreen('dashboard')}
                  soundEnabled={settings.soundEnabled}
                />
              )}

              {currentScreen === 'sensor_prep' && (
                <Screen04SensorPrep
                  selectedCrop={selectedCrop}
                  onStartMeasurement={handleStartMeasurement}
                  onBack={() => setCurrentScreen('crop_select')}
                  soundEnabled={settings.soundEnabled}
                  samplingDepthCm={settings.samplingDepthCm}
                />
              )}

              {currentScreen === 'measurement' && (
                <Screen05Measurement
                  selectedCrop={selectedCrop}
                  onComplete={handleMeasurementComplete}
                  onCancel={() => setCurrentScreen('sensor_prep')}
                  soundEnabled={settings.soundEnabled}
                />
              )}

              {currentScreen === 'results' && (
                <Screen06Results
                  selectedCrop={selectedCrop}
                  readings={currentReadings}
                  onGetFertilizerAdvice={handleGetFertilizerAdvice}
                  onRetestSoil={handleRetestSoil}
                  onBack={() => setCurrentScreen('measurement')}
                  soundEnabled={settings.soundEnabled}
                />
              )}

              {currentScreen === 'fertilizer' && (
                <Screen07Fertilizer
                  selectedCrop={selectedCrop}
                  readings={currentReadings}
                  recommendation={activeRecord.recommendation}
                  onViewApplicationGuide={() => setActiveModal('application_guide')}
                  onSaveRecommendation={handleSaveRecommendation}
                  onBack={() => setCurrentScreen('results')}
                  soundEnabled={settings.soundEnabled}
                />
              )}

              {currentScreen === 'completion' && (
                <Screen08Completion
                  record={activeRecord}
                  settings={settings}
                  onViewFullReport={() => setActiveModal('full_report')}
                  onNewSoilTest={handleNewSoilTest}
                  onGoHome={handleGoHome}
                  onTriggerSync={handleTriggerSync}
                  soundEnabled={settings.soundEnabled}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {activeModal === 'application_guide' && (
        <ApplicationGuideModal
          crop={selectedCrop}
          recommendation={activeRecord.recommendation}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'full_report' && (
        <FullReportModal
          record={activeRecord}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'previous_results' && (
        <PreviousResultsModal
          records={records}
          onSelectRecord={(r) => {
            setActiveRecord(r);
            setSelectedCrop(r.crop);
            setCurrentReadings(r.readings);
            setActiveModal('full_report');
          }}
          onClose={() => setActiveModal(null)}
          soundEnabled={settings.soundEnabled}
        />
      )}

      {activeModal === 'device_status' && (
        <DeviceStatusModal
          settings={settings}
          onClose={() => setActiveModal(null)}
          soundEnabled={settings.soundEnabled}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          settings={settings}
          onSaveSettings={handleUpdateSettings}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
