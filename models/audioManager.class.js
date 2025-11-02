/**
 * Central audio registry that provides easy access to all game sounds.
 */
class AudioManager {
	/**
	 * Creates the audio collection and remembers the mute state.
	 */
	constructor() {
		this.tracks = {
			background_drum: this.createAudio('audio/background_drum_sound.mp3', { loop: true, volume: 0.35 }),
			background_wildwest: this.createAudio('audio/background_wildwest_sound.mp3', { loop: true, volume: 0.35 }),
			boss_hit: this.createAudio('audio/boss_hit_sound.mp3'),
			chicken_death: this.createAudio('audio/chicken_death_sound.mp3'),
			endboss_die: this.createAudio('audio/endboss_die_sound.mp3'),
			pepe_jump: this.createAudio('audio/pepe_jump_sound.mp3'),
			pepe_walk: this.createAudio('audio/pepe_walk_sound.mp3', { loop: true, volume: 0.5 }),
		};
		this.isMuted = false;
	}

	/**
	 * Creates an HTMLAudioElement and applies optional settings.
	 * @param {string} src - Path to the audio file.
	 * @param {{loop?:boolean,volume?:number}} [options] - Playback configuration.
	 * @returns {HTMLAudioElement} Prepared audio element.
	 */
	createAudio(src, options = {}) {
		const audio = new Audio(src);
		audio.loop = !!options.loop;
		audio.volume = options.volume ?? 1;
		return audio;
	}

	/**
	 * Toggles or sets the mute state for every registered track.
	 * @param {boolean} [state] - Optional desired mute state.
	 */
	muteAll(state) {
		const targetState = typeof state === 'boolean' ? state : !this.isMuted;
		this.isMuted = targetState;
		Object.values(this.tracks).forEach((audio) => {
			audio.muted = targetState;
		});
	}

	/**
	 * Plays a track identified by name.
	 * @param {string} name - Key of the track inside {@link AudioManager#tracks}.
	 */
	playSound(name) {
		const audio = this.tracks[name];
		if (!audio) {
			return;
		}
		audio.muted = this.isMuted;
		audio.currentTime = 0;
		audio.play().catch(() => {});
	}

	/**
	 * Stops a named track and rewinds it to the beginning.
	 * @param {string} name - Key of the track to stop.
	 */
	stopSound(name) {
		const audio = this.tracks[name];
		if (!audio) {
			return;
		}
		audio.pause();
		audio.currentTime = 0;
	}

	/**
	 * Returns all registered tracks, useful for debugging or UI binding.
	 * @returns {Record<string, HTMLAudioElement>} Map of track elements.
	 */
	getAllTracks() {
		return this.tracks;
	}
}
