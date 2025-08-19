import { useVideoPlayer, VideoView, VideoPlayerStatus } from "expo-video";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

interface VideoPlayerProps {
  children?: React.ReactNode | undefined;
  source: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface FullscreenVideoProps {
  source: string;
  currentTime: number;
  onExit: (currentTime: number) => void;
}

export default function VideoPlayer({
  children = null,
  source,
  onFocus,
  onBlur,
}: VideoPlayerProps) {
  const [playing, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <Pressable
      onPress={() => setIsPlaying(true)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}

      {playing ? (
        <FullscreenVideo
          source={source}
          onExit={(e) => {
            setIsPlaying(false);
            setCurrentTime(e);
          }}
          currentTime={currentTime}
        />
      ) : null}
    </Pressable>
  );
}

function FullscreenVideo({
  source,
  onExit,
  currentTime,
}: FullscreenVideoProps) {
  const ref = useRef<VideoView>(null);
  const [videoStatus, setVideoStatus] = useState<VideoPlayerStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const lastSetTime = useRef<number | null>(null);

  const playeritem = useVideoPlayer(source, (player) => {
    player.addListener("statusChange", (payload) => {
      setVideoStatus(payload.status);
    });
  });

  // Set currentTime when player is ready or when currentTime prop changes
  useEffect(() => {
    if (
      playeritem &&
      videoStatus === "readyToPlay" &&
      currentTime > 0 && // Only set if currentTime is greater than 0
      lastSetTime.current !== currentTime
    ) {
      try {
        playeritem.currentTime = currentTime;
        lastSetTime.current = currentTime;
      } catch (err) {
        console.error("Failed to set currentTime:", err);
      }
    }
  }, [playeritem, videoStatus, currentTime]);

  // Memoize the play function to prevent unnecessary re-renders
  const handlePlay = useCallback(() => {
    try {
      if (playeritem && videoStatus === "readyToPlay") {
        playeritem.play();
      }
    } catch (err) {
      setError("Failed to play video");
      console.error("Play error:", err);
    }
  }, [playeritem, videoStatus]);

  // Memoize the fullscreen enter function
  const enterFullscreen = useCallback(() => {
    try {
      if (
        ref.current &&
        (videoStatus === "readyToPlay" || videoStatus === "loading")
      ) {
        ref.current.enterFullscreen();
      }
    } catch (err) {
      setError("Failed to enter fullscreen");
      console.error("Fullscreen error:", err);
    }
  }, [videoStatus]);

  useEffect(() => {
    if (videoStatus === "readyToPlay") {
      // Use setTimeout to ensure ref is available
      const timer = setTimeout(() => {
        enterFullscreen();
        handlePlay();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [videoStatus, enterFullscreen, handlePlay]);

  const handleFullscreenExit = useCallback(() => {
    try {
      if (playeritem) {
        playeritem.pause();
      }
      onExit(playeritem.currentTime);
    } catch (err) {
      console.error("Fullscreen exit error:", err);
      onExit(playeritem.currentTime); // Still call onExit even if pause fails
    }
  }, [playeritem, onExit]);

  // Show error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Video Error: {error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onExit(currentTime)}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <VideoView
      ref={ref}
      player={playeritem}
      allowsFullscreen
      onFullscreenExit={handleFullscreenExit}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  videoStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 2 * verticalScale(200),
    height: verticalScale(200),
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#4630ec",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#eeeeee",
    textAlign: "center",
  },
  video: {
    width: scale(300),
    height: scale(168.75),
  },
});
