'use client';

import React from 'react';
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

export default function HomePage() {
  const { toasts, showToast, removeToast } = useToast();
  const audioEngine = useAudioEngine(showToast);

  return (
    <>
      <Header
        status={audioEngine.backendStatus}
        statusText={audioEngine.backendStatusText}
        onCheckHealth={() => {
          audioEngine.checkHealth();
          showToast(`Checking engine at: ${audioEngine.baseUrl}`, 'info');
        }}
      />

      <main className="app-main">
        <HeroSection />

        <SearchConverterCard
          query={audioEngine.query}
          onQueryChange={audioEngine.handleQueryChange}
          onClear={audioEngine.clearQuery}
          onPaste={audioEngine.pasteFromClipboard}
          videoPreview={audioEngine.videoPreview}
          isSearching={audioEngine.isSearching}
          isConverting={audioEngine.isConverting}
          visualizerActive={audioEngine.visualizerActive}
          onSubmit={audioEngine.handleSearchOrConvert}
        />

        {audioEngine.searchResults.length > 0 && !audioEngine.isConverting && (
          <SearchResultsList
            tracks={audioEngine.searchResults}
            onSelectTrack={(track) => audioEngine.startDownloadTrack(track)}
          />
        )}

        <PipelineStepper
          currentStep={audioEngine.pipelineStep}
          customMessage={audioEngine.pipelineMessage}
          isVisible={audioEngine.isConverting}
        />

        <ResultCard
          result={audioEngine.conversionResult}
          onReset={audioEngine.resetForm}
        />
      </main>

      <Footer />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
