import React from 'react';
import { GoogleGenAI } from '@google/genai';

import useGpsProcessor from './hooks/useGpsProcessor';
import useFuelCalculator from './hooks/useFuelCalculator';
import { useBoundStore } from '../../store/useBoundStore';
import Speedometer from './components/Speedometer';
import FuelGauge from './components/FuelGauge';
import Odometer from './components/Odometer';
import GpsStatus from './components/GpsStatus';
import RangeEstimator from './components/RangeEstimator';
import Card from '../../components/Card';
import Button from '../../components/Button';

// --- AI Assistant Component ---
// Defined in-file to adhere to project constraints.
const AiAssistant = () => {
  const {
    currentSpeedKph,
    currentFuelL,
    aiTip,
    isGeneratingTip,
    aiError,
  } = useBoundStore((state) => ({
    currentSpeedKph: state.currentSpeedKph,
    currentFuelL: state.currentFuelL,
    aiTip: state.aiTip,
    isGeneratingTip: state.isGeneratingTip,
    aiError: state.aiError,
  }));
  const { setAiIsGenerating, setAiTip } = useBoundStore(
    (state) => state.actions,
  );

  const handleGetTip = async () => {
    setAiIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are an AI assistant for a futuristic motorcycle. Current Speed: ${currentSpeedKph.toFixed(0)} km/h. Current Fuel: ${currentFuelL.toFixed(1)}L. Provide a single, concise tip (max 20 words) for improving fuel economy. Be encouraging and slightly robotic.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAiTip(response.text);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setAiTip(
        null,
        'Connection to AI core failed. Check network.',
      );
    }
  };

  return (
    <Card>
      <div className="flex h-full flex-col justify-between text-center">
        <div>
          <p className="text-sm uppercase text-brand-secondary">AI Assistant</p>
          <div className="mt-2 min-h-[60px]">
            {isGeneratingTip && (
              <p className="animate-pulse text-brand-primary">Analyzing...</p>
            )}
            {aiError && <p className="text-brand-error">{aiError}</p>}
            {aiTip && !isGeneratingTip && <p className="text-brand-light">{aiTip}</p>}
          </div>
        </div>
        <Button onClick={handleGetTip} disabled={isGeneratingTip}>
          Get Eco Tip
        </Button>
      </div>
    </Card>
  );
};


// This is the "Container" component. It orchestrates data flow from hooks and the global store,
// and passes it down to "Presentational" components.
function DashboardPage() {
  // These hooks manage the complex real-time data processing.
  useGpsProcessor();
  useFuelCalculator();

  const {
    currentSpeedKph,
    currentFuelL,
    tripKm,
    totalOdometerKm,
    isGpsAvailable,
  } = useBoundStore((state) => ({
    currentSpeedKph: state.currentSpeedKph,
    currentFuelL: state.currentFuelL,
    tripKm: state.tripKm,
    totalOdometerKm: state.totalOdometerKm,
    isGpsAvailable: state.isGpsAvailable,
  }));
  
  // OPTIMIZATION: Select primitive values individually to prevent re-renders when other settings change.
  const tankCapacityL = useBoundStore((state) => state.settings.tankCapacityL);
  const fuelEconomyKmPerL = useBoundStore(
    (state) => state.settings.fuelEconomyKmPerL,
  );
  const ecoModeTipsEnabled = useBoundStore(
    (state) => state.settings.ecoModeTipsEnabled,
  );

  return (
    <div className="grid h-full grid-cols-1 grid-rows-3 gap-4 p-4 md:grid-cols-3 md:grid-rows-2">
      <div className="flex items-center justify-center md:col-span-2 md:row-span-2">
        <Speedometer speed={currentSpeedKph} />
      </div>
      <div className="flex items-center justify-center">
        <FuelGauge
          currentFuel={currentFuelL}
          tankCapacity={tankCapacityL}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Odometer label="Trip" distance={tripKm} />
        <Odometer label="Total" distance={totalOdometerKm} />
        <RangeEstimator
          currentFuel={currentFuelL}
          economy={fuelEconomyKmPerL}
        />
        {ecoModeTipsEnabled ? <AiAssistant /> : <GpsStatus isAvailable={isGpsAvailable} />}
      </div>
    </div>
  );
}

export default DashboardPage;
