'use client';

import React, { useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SearchConverterCard } from '@/components/SearchConverterCard';
import { SearchResultsList } from '@/components/SearchResultsList';
import { PipelineStepper } from '@/components/PipelineStepper';
import { ResultCard } from '@/components/ResultCard';
import { Footer } from '@/components/Footer';
import { ToastContainer } from '@/components/ToastContainer';
import { useToast } from '@/hooks/useToast';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useTheme } from '@/hooks/useTheme';

export default function HomePage() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const audioEngine = useAudioEngine(showToast);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const pipelineRef = useRef<HTMLDivElement | null>(null);
  const resultCardRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll so the FIRST song choice comes into the center of the screen
  useEffect(() => {
    if (audioEngine.searchResults.length > 0 && !audioEngine.isConverting) {
      const timer = setTimeout(() => {
        const firstSong = document.getElementById('firstTrackChoice');
        if (firstSong) {
          firstSong.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [audioEngine.searchResults, audioEngine.isConverting]);

  // For link / conversion case: scroll so the Audio Pipeline card ("Connecting to crisper Audio Core") comes to the center
  useEffect(() => {
    if (audioEngine.isConverting) {
      const timer = setTimeout(() => {
        pipelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [audioEngine.isConverting]);

  // Auto-scroll to Result Card when track mastering finishes
  useEffect(() => {
    if (audioEngine.conversionResult) {
      const timer = setTimeout(() => {
        resultCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [audioEngine.conversionResult]);

  return (
    <>
      <Header
        status={audioEngine.backendStatus}
        statusText={audioEngine.backendStatusText}
        onCheckHealth={() => {
          audioEngine.checkHealth();
          showToast(`Checking engine at: ${audioEngine.baseUrl}`, 'info');
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        themeMounted={mounted}
      />

      <main className="app-main">
        <HeroSection />

        <SearchConverterCard
          query={audioEngine.query}
          onQueryChange={audioEngine.handleQueryChange}
          onClear={audioEngine.clearQuery}
          videoPreview={audioEngine.videoPreview}
          isSearching={audioEngine.isSearching}
          isConverting={audioEngine.isConverting}
          visualizerActive={audioEngine.visualizerActive}
          onSubmit={audioEngine.handleSearchOrConvert}
        />

        {audioEngine.searchResults.length > 0 && !audioEngine.isConverting && (
          <div ref={resultsRef}>
            <SearchResultsList
              tracks={audioEngine.searchResults}
              onSelectTrack={(track) => audioEngine.startDownloadTrack(track)}
            />
          </div>
        )}

        <div ref={pipelineRef}>
          <PipelineStepper
            currentStep={audioEngine.pipelineStep}
            customMessage={audioEngine.pipelineMessage}
            isVisible={audioEngine.isConverting}
          />
        </div>

        <div ref={resultCardRef}>
          <ResultCard
            result={audioEngine.conversionResult}
            onReset={audioEngine.resetForm}
          />
        </div>
      </main>

      <Footer />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
