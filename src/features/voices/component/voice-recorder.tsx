import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { useAudioRecorder } from "../hooks/use-audio-recorder";
import { Button } from "@/components/ui/button";
import { FileAudio, Pause, Play, X } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

function formatTime(seconds : number){
    const h = Math.floor(seconds / 3600) ;
    const m = Math.floor((seconds % 3600) / 60) ;
    const s = Math.floor(seconds & 60);

    return `${String(h).padStart(2 , '0')}:${String(m).padStart(2 , '0')}:${String(s).padStart(2 , '0')}`
}

export function VoiceRecorder({
    file ,
    onFileChange ,
    isInvalid,
}:{
    file : File ;
    onFileChange : (file : File | null) => void ;
    isInvalid? : boolean;
}){
    const { isPlaying , togglePlay } = useAudioPlayback(file);

    const {
        isRecording ,
        elapsedTime ,
        audioBlob ,
        containerRef ,
        error ,
        startRecording ,
        stopRecording ,
        resetRecording
    } = useAudioRecorder();

    const handleStop = () =>{
        stopRecording((blob) =>{
            const recordedFile = new File([blob] , 'recording.wav' , {
                type : 'audio/wav' ,
            });
            onFileChange(recordedFile);
        })
    }

    const handleReRecord = () =>{
        onFileChange(null) ;
        resetRecording();
    };

    if(error){
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/50 bg-destructive/5 px-6 py-10">
                <p className="text-center text-sm text-destructive">{error}</p>
                <Button 
                    type='button'
                    variant={'outline'}
                    size='sm'
                    onClick={resetRecording} 
                >
                    Try again
                </Button>
            </div>
        )
    }

    if(file){
        return (
            <div className='flex items-center gap-3 rounded-xl border p-4'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-muted'>
                    <FileAudio className='size-5 text-muted-foreground'  />
                </div>

                <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>{file.name}</p>
                    <p className='text-xs text-muted-foreground'>
                        {formatFileSize(file.size)}
                        {audioBlob && elapsedTime > 0 && (
                            <>&nbsp;&middot;&nbsp;{formatTime(elapsedTime)}</>
                        )}
                    </p>
                </div>

                <Button
                    type='button'
                    variant={'ghost'}
                    size='icon-sm'
                    onClick={togglePlay}
                >
                    {isPlaying ? (
                        <Pause className='size-4' />
                    ) : (
                        <Play className='size-4' />
                    )}
                </Button>
                <Button
                    type='button'
                    variant={'ghost'}
                    size='icon-sm'
                    onClick={() => onFileChange(null)}
                >
                    <X className='size-4' />
                </Button>
            </div>
        )
    }
}