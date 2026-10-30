// Used AI to fix the issue of music not being played automatically

import { useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { useMusicStore } from "#/store/music";
import { useWindowStore } from "#/store/window";

function MediaPlayerEngine() {
	const audioElementRef = useRef<HTMLAudioElement>(null);
	const youTubePlayerRef = useRef<YouTube>(null);
	const timeUpdateIntervalRef = useRef<NodeJS.Timeout>(null);
	const previousMusicWindowCountRef = useRef(0);
	const youTubeReadyRef = useRef(false);

	const track = useMusicStore((state) => state.tracks[state.currentIndex]);
	const isYouTubeTrack = track?.type === "youtube";
	const youTubeVideoId = track?.youtubeId;
	const isPlaying = useMusicStore((state) => state.isPlaying);
	const volume = useMusicStore((state) => state.volume);
	const muted = useMusicStore((state) => state.muted);
	const repeat = useMusicStore((state) => state.repeat);
	const nextTrack = useMusicStore((state) => state.next);
	const setPlaying = useMusicStore((state) => state.setPlaying);
	const setYouTubePlayerAPI = useMusicStore(
		(state) => state.setYouTubePlayerAPI,
	);
	const setAudioElement = useMusicStore((state) => state.setAudioElement);
	const stopPlayback = useMusicStore((state) => state.stopPlayback);

	useEffect(() => {
		if (audioElementRef.current) {
			setAudioElement(audioElementRef.current);
		}
		return () => setAudioElement(null);
	}, [setAudioElement]);

	useEffect(() => {
		const checkWindows = () => {
			const { windows } = useWindowStore.getState();
			const openMusicWindows = Object.values(windows).filter(
				(windowInstance) => windowInstance?.appId === "music",
			);
			const currentCount = openMusicWindows.length;

			if (currentCount === 0 && previousMusicWindowCountRef.current > 0) {
				stopPlayback();
			}
			previousMusicWindowCountRef.current = currentCount;
		};

		checkWindows();
		const unsubscribe = useWindowStore.subscribe(
			(state) => state.windows,
			checkWindows,
		);
		return () => unsubscribe();
	}, [stopPlayback]);

	useEffect(() => {
		const audio = audioElementRef.current;
		if (!audio || isYouTubeTrack) return;

		const onTimeUpdate = () => {
			useMusicStore.setState((state) => {
				state.currentTime = audio.currentTime;
			});
		};
		const onEnded = () => {
			if (repeat) {
				audio.currentTime = 0;
				audio.play().catch(() => { });
			} else {
				nextTrack();
			}
		};
		const onLoadedMetadata = () => {
			useMusicStore.setState((state) => {
				state.duration = audio.duration;
			});
		};

		audio.addEventListener("timeupdate", onTimeUpdate);
		audio.addEventListener("ended", onEnded);
		audio.addEventListener("loadedmetadata", onLoadedMetadata);
		return () => {
			audio.removeEventListener("timeupdate", onTimeUpdate);
			audio.removeEventListener("ended", onEnded);
			audio.removeEventListener("loadedmetadata", onLoadedMetadata);
		};
	}, [isYouTubeTrack, repeat, nextTrack]);

	useEffect(() => {
		const audio = audioElementRef.current;
		if (!audio || isYouTubeTrack) return;

		audio.muted = muted;
		audio.volume = volume;

		if (isPlaying) {
			audio.play().catch((err) => {
				if (err?.name === "NotAllowedError") {
					setPlaying(false);
				}
			});
		} else {
			audio.pause();
		}
	}, [isPlaying, isYouTubeTrack, muted, volume, setPlaying]);

	useEffect(() => {
		if (!isYouTubeTrack) return;
		const player = youTubePlayerRef.current?.internalPlayer;
		if (!player) return;

		player.setVolume(muted ? 0 : volume * 100);

		if (isPlaying) {
			const maybePromise = player.playVideo();
			if (maybePromise && typeof maybePromise.catch === "function") {
				maybePromise.catch((err: { name?: string }) => {
					if (err?.name === "NotAllowedError") {
						setPlaying(false);
					}
				});
			}
		} else {
			player.pauseVideo();
		}
	}, [isYouTubeTrack, isPlaying, muted, volume, track?.id, setPlaying]);

	useEffect(() => {
		if (!isYouTubeTrack || !youTubePlayerRef.current?.internalPlayer) return;
		timeUpdateIntervalRef.current = setInterval(async () => {
			if (!youTubePlayerRef.current?.internalPlayer) return;
			try {
				const currentTime =
					await youTubePlayerRef.current.internalPlayer.getCurrentTime();
				const duration =
					await youTubePlayerRef.current.internalPlayer.getDuration();
				if (isPlaying) {
					useMusicStore.setState((state) => {
						state.currentTime = currentTime;
						state.duration = duration;
					});
				}
			} catch {
				/* ignored */
			}
		}, 1000);
		return () => clearInterval(timeUpdateIntervalRef.current);
	}, [isYouTubeTrack, isPlaying, track?.id]);

	useEffect(() => {
		if (!muted) return;

		const unmute = () => {
			useMusicStore.getState().setMuted(false);
		};

		document.addEventListener("pointerdown", unmute, { once: true });
		return () => document.removeEventListener("pointerdown", unmute);
	}, [muted]);

	return (
		<div
			style={{
				position: "absolute",
				width: 0,
				height: 0,
				overflow: "hidden",
				opacity: 0,
			}}
		>
			<audio ref={audioElementRef} />
			{isYouTubeTrack && youTubeVideoId && (
				<YouTube
					ref={youTubePlayerRef}
					videoId={youTubeVideoId}
					opts={{
						width: 1,
						height: 1,
						playerVars: {
							autoplay: 0,        // ← force 0; React drives playback
							controls: 0,
							disablekb: 1,
							origin: window.location.origin,
							enablejsapi: 1,
						},
					}}
					onReady={(event) => {
						youTubeReadyRef.current = true;
						setYouTubePlayerAPI({
							playVideo: () => event.target.playVideo(),
							pauseVideo: () => event.target.pauseVideo(),
							seekTo: (seconds, allowSeekAhead) =>
								event.target.seekTo(seconds, allowSeekAhead),
							getCurrentTime: () => event.target.getCurrentTime(),
							getDuration: () => event.target.getDuration(),
							setVolume: (value) => event.target.setVolume(value),
						});

						event.target.setVolume(muted ? 0 : volume * 100);
						if (isPlaying) {
							const maybePromise = event.target.playVideo();
							if (
								maybePromise &&
								typeof maybePromise.catch === "function"
							) {
								maybePromise.catch((err: { name?: string }) => {
									if (err?.name === "NotAllowedError") {
										setPlaying(false);
									}
								});
							}
						}
					}}
					onEnd={() => {
						if (repeat) {
							youTubePlayerRef.current?.internalPlayer?.seekTo(0);
							youTubePlayerRef.current?.internalPlayer?.playVideo();
						} else {
							nextTrack();
						}
					}}
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
				/>
			)}
		</div>
	);
}

export default MediaPlayerEngine;