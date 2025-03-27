import { useState, useRef, useEffect } from 'react';
import { Pause, Play, SkipBack, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from "@/integrations/supabase/client";
import { VoiceSettingsValues, defaultVoiceSettings } from './VoiceSettings';
import VoiceSettings from './VoiceSettings';
import { toast } from 'sonner';

interface AudioPlayerProps {
  text: string;
  autoPlay?: boolean;
}

const AudioPlayer = ({ text, autoPlay = false }: AudioPlayerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsValues>(defaultVoiceSettings);
  const [isDownloading, setIsDownloading] = useState(false);

  const generateSpeech = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the Supabase Edge Function with the specific voice ID and voice settings
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        method: 'POST',
        body: { 
          text,
          voiceId: 'DvFda1rsV3AtCHHcmSgM', // User's specified voice ID
          voiceSettings: {
            model_id: voiceSettings.model,
            voice_settings: {
              stability: voiceSettings.stability,
              similarity_boost: voiceSettings.similarity,
              style: voiceSettings.style,
              use_speaker_boost: voiceSettings.speakerBoost,
              speaking_rate: voiceSettings.speed
            }
          }
        },
      });

      if (error) {
        console.error('Error generating speech:', error);
        setError('Failed to generate speech');
        toast.error('Failed to generate speech');
        return;
      }

      // Create a blob from the response data
      const response = await fetch(`data:audio/mpeg;base64,${data.audioContent}`);
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioGenerated(true);
      
      // Set audio source
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load(); // Ensure audio is loaded properly
        
        // Play audio after generation if the play button was clicked
        try {
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(err => {
                console.error('Error during play:', err);
                // Play was prevented, we'll require user interaction
              });
          }
        } catch (err) {
          console.error('Error playing audio:', err);
        }
      }
    } catch (err) {
      console.error('Error in generateSpeech:', err);
      setError('Failed to generate speech');
      toast.error('Failed to generate speech');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      // If already playing, just pause
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      // If not playing and no audio is generated yet, generate it first
      if (!audioGenerated) {
        await generateSpeech(); 
        // The generateSpeech function will handle playing after generation
      } else {
        // If audio is already generated, just play it
        if (audioRef.current) {
          if (!audioRef.current.src && audioUrl) {
            audioRef.current.src = audioUrl;
            audioRef.current.load();
          }
          
          try {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setIsPlaying(true);
                })
                .catch(err => {
                  console.error('Error playing audio:', err);
                  toast.error('Error playing audio. Please try again.');
                });
            }
          } catch (err) {
            console.error('Error playing audio:', err);
            toast.error('Error playing audio. Please try again.');
          }
        }
      }
    }
  };
  
  const skipToBeginning = () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    if (!isPlaying && audioGenerated) {
      // Ensure audio has a source before playing
      if (!audioRef.current.src && audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Error playing audio:', err);
          toast.error('Error playing audio. Please try again.');
        });
    }
  };

  // Handle voice settings change - only regenerate if audio has already been generated once
  const handleVoiceSettingsChange = (newSettings: VoiceSettingsValues) => {
    setVoiceSettings(newSettings);
    // Reset audio state since settings changed
    if (audioGenerated) {
      setAudioGenerated(false);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      if (audioRef.current) {
        audioRef.current.src = '';
      }
      setIsPlaying(false);
    }
  };

  // Download audio functionality
  const downloadAudio = async () => {
    if (!audioGenerated) {
      // Generate the audio first if it hasn't been generated yet
      await generateSpeech();
    }

    if (!audioUrl) {
      toast.error('No audio available to download');
      return;
    }

    setIsDownloading(true);
    try {
      // Download as file
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const fileName = `audio-${Date.now()}.mp3`;
      
      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('Audio downloaded successfully');
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast.error('Failed to download audio');
    } finally {
      setIsDownloading(false);
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle audio ended event
  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  return (
    <Card className="bg-white backdrop-blur-sm border border-primary/20 p-2 rounded-lg hover:shadow-md transition-all">
      <div className="flex items-center justify-between w-full">
        <span className="text-sm font-medium mr-2 text-muted-foreground">Audio</span>
        
        <div className="flex items-center space-x-1">
          <audio ref={audioRef} />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={skipToBeginning}
            disabled={isLoading || !audioGenerated}
          >
            <SkipBack className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={togglePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={downloadAudio}
            disabled={isLoading && !audioGenerated}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          
          <VoiceSettings 
            settings={voiceSettings} 
            onChange={handleVoiceSettingsChange} 
          />
        </div>
      </div>
      
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </Card>
  );
};

export default AudioPlayer;
