// Verwaltet alle Audio-Clips des Spiels an einer zentralen Stelle.
class AudioManager {
	// Konstruktor: legt jede Tonspur an und merkt sich den globalen Mute-Status.
	constructor() {
		// Sammlung der einzelnen Sounds, angesprochen ueber kurze Namen.
		this.tracks = {
			// Hintergrundmusik mit Schlagzeug, leise loopend.
			background_drum: this.createAudio('audio/background_drum_sound.mp3', { loop: true, volume: 0.35 }),
			// Alternative Western-Musik, ebenfalls als Loop gedacht.
			background_wildwest: this.createAudio('audio/background_wildwest_sound.mp3', { loop: true, volume: 0.35 }),
			// Treffer-Sound wenn der Endboss Schaden nimmt.
			boss_hit: this.createAudio('audio/boss_hit_sound.mp3'),
			// Sound beim Besiegen eines Huhns.
			chicken_death: this.createAudio('audio/chicken_death_sound.mp3'),
			// Sound wenn der Endboss stirbt.
			endboss_die: this.createAudio('audio/endboss_die_sound.mp3'),
			// Sprunggeraeusch von Pepe.
			pepe_jump: this.createAudio('audio/pepe_jump_sound.mp3'),
			// Laufgeraeusch von Pepe.
			pepe_walk: this.createAudio('audio/pepe_walk_sound.mp3', { loop: true, volume: 0.5 }),
		};
		// Speichert, ob das Spiel aktuell stumm geschaltet ist.
		this.isMuted = false;
	}

	// Erstellt ein Audio-Objekt inklusive optionaler Einstellungen.
	createAudio(src, options = {}) {
		// Baut ein neues HTMLAudioElement mit dem uebergebenen Pfad.
		const audio = new Audio(src);
		// Aktiviert das Looping, falls im Options-Objekt gefordert.
		audio.loop = !!options.loop;
		// Setzt die Lautstaerke oder faellt auf den Standardwert 1 zurueck.
		audio.volume = options.volume ?? 1;
		// Gibt das vorbereitete Audio an den Aufrufer zurueck.
		return audio;
	}

	// Schaltet alle Tonspuren stumm oder hebt die Stummschaltung auf.
	muteAll(state) {
		// Bestimmt den Zielzustand: uebernommen oder per Toggle gewechselt.
		const targetState = typeof state === 'boolean' ? state : !this.isMuted;
		// Sichert den aktuellen Mute-Zustand fuer spaetere Abfragen.
		this.isMuted = targetState;
		// Uebernimmt den Zustand fuer jedes Audio in der Sammlung.
		Object.values(this.tracks).forEach((audio) => {
			audio.muted = targetState;
		});
	}

	// Spielt eine Tonspur anhand ihres Namens ab.
	playSound(name) {
		// Sucht das passende Audio-Element aus der Sammlung.
		const audio = this.tracks[name];
		// Bricht ab, falls der Name unbekannt ist.
		if (!audio) {
			return;
		}
		// Wendet den aktuellen Mute-Zustand auf diesen Track an.
		audio.muted = this.isMuted;
		// Springt an den Anfang, damit der Clip komplett laeuft.
		audio.currentTime = 0;
		// Startet die Wiedergabe; ignoriert blockierte Autoplay-Versuche.
		audio.play().catch(() => {});
	}

	// Stoppt eine Tonspur und setzt sie auf den Anfang zurueck.
	stopSound(name) {
		const audio = this.tracks[name];
		if (!audio) {
			return;
		}
		audio.pause();
		audio.currentTime = 0;
	}

	// Liefert die komplette Track-Sammlung, z. B. fuer Debugging oder eigene Buttons.
	getAllTracks() {
		return this.tracks;
	}
}
