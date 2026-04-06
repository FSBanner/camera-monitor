import { useState, useEffect } from 'react';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const [cameras, setCameras] = useState([]);
  const [notes, setNotes] = useState({});
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all'); // 'all' or 'critical'
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Cargar notas del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cameraMonitorNotes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading notes:', e);
      }
    }
  }, []);

  // Fetch cameras from API — the API now returns clean JSON
  const fetchCameras = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cameras');
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('Camera API error:', err);
        return;
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setCameras(data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCameras();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchCameras, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Guardar notas
  const saveNotes = (updatedNotes) => {
    setNotes(updatedNotes);
    localStorage.setItem('cameraMonitorNotes', JSON.stringify(updatedNotes));
  };

  const handleAddNote = () => {
    if (!selectedCameraId || !noteText.trim()) return;
    const cameraNotes = notes[selectedCameraId] || [];
    const newNote = {
      id: Date.now(),
      text: noteText,
      timestamp: new Date().toLocaleString('es-AR')
    };
    saveNotes({
      ...notes,
      [selectedCameraId]: [newNote, ...cameraNotes]
    });
    setNoteText('');
  };

  const handleDeleteNote = (cameraId, noteId) => {
    const updated = notes[cameraId].filter(n => n.id !== noteId);
    saveNotes({
      ...notes,
      [cameraId]: updated.length > 0 ? updated : undefined
    });
  };

  const statusConfig = {
    down: { label: 'Down', color: '#E24B4A', priority: 1, abbr: '🔴' },
    not_recording: { label: 'Not Recording', color: '#BA7517', priority: 2, abbr: '🟠' },
    pending: { label: 'Pending', color: '#EF9F27', priority: 3, abbr: '🟡' },
    uploading: { label: 'Uploading', color: '#7CB342', priority: 3.5, abbr: '🟢' },
    recording: { label: 'Recording', color: '#639922', priority: 4, abbr: '🟢' },
    manual: { label: 'Manual', color: '#185FA5', priority: 5, abbr: '🔵' },
    inactive: { label: 'Inactive', color: '#888780', priority: 6, abbr: '⚫' },
  };

  // Datos para vista actual
  let displayCameras = cameras;
  if (view === 'critical') {
    displayCameras = cameras.filter(c => c.status === 'down' || c.status === 'not_recording');
  }

  // Aplicar filtros
  const filtered = displayCameras.filter(cam => {
    const matchesFilter = filter === 'all' ? true : cam.status === filter;
    const matchesSearch = search === '' ? true : 
      cam.name.toLowerCase().includes(search.toLowerCase()) ||
      cam.ip.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const allCritical = cameras.filter(c => c.status === 'down' || c.status === 'not_recording');
  const stats = {
    down: cameras.filter(c => c.status === 'down').length,
    not_recording: cameras.filter(c => c.status === 'not_recording').length,
    pending: cameras.filter(c => c.status === 'pending').length,
    uploading: cameras.filter(c => c.status === 'uploading').length,
    recording: cameras.filter(c => c.status === 'recording').length,
    manual: cameras.filter(c => c.status === 'manual').length,
    inactive: cameras.filter(c => c.status === 'inactive').length,
    total: cameras.length,
    critical: allCritical.length,
  };

  const activeTotal = cameras.filter(c => c.status !== 'inactive').length;
  const selectedCamera = cameras.find(c => c.id === selectedCameraId);
  const cameraNotesDisplay = selectedCameraId ? notes[selectedCameraId] || [] : [];

  return (
    <div className={styles.container}>
      {/* Main Panel */}
      <div className={styles.mainPanel}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1>📹 Camera Monitor</h1>
              <p>Seguimiento y control de cámaras en tiempo real</p>
            </div>
            <div className={styles.criticalBadge}>
              <div className={styles.criticalNumber}>{stats.critical}</div>
              <p>Críticas</p>
            </div>
          </div>

          {/* View Tabs */}
          <div className={styles.tabs}>
            <button
              onClick={() => { setView('all'); setFilter('all'); }}
              className={`${styles.tab} ${view === 'all' ? styles.tabActive : ''}`}
            >
              Activas ({activeTotal})
            </button>
            <button
              onClick={() => { setView('critical'); setFilter('all'); }}
              className={`${styles.tab} ${styles.tabCritical} ${view === 'critical' ? styles.tabActive : ''}`}
            >
              Down + Not Recording ({stats.critical})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Stats */}
          {view === 'all' && (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Down</p>
                <p className={styles.statValue} style={{ color: '#E24B4A' }}>{stats.down}</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Not Recording</p>
                <p className={styles.statValue} style={{ color: '#BA7517' }}>{stats.not_recording}</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Pending</p>
                <p className={styles.statValue} style={{ color: '#EF9F27' }}>{stats.pending}</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Recording</p>
                <p className={styles.statValue} style={{ color: '#639922' }}>{stats.recording}</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {view === 'all' && (
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todas ({cameras.length})</option>
                <option value="down">Down ({stats.down})</option>
                <option value="not_recording">Not Recording ({stats.not_recording})</option>
                <option value="pending">Pending ({stats.pending})</option>
                <option value="uploading">Uploading ({stats.uploading})</option>
                <option value="recording">Recording ({stats.recording})</option>
                <option value="manual">Manual ({stats.manual})</option>
                <option value="inactive">Inactive ({stats.inactive})</option>
              </select>
            )}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`${styles.refreshBtn} ${autoRefresh ? styles.refreshBtnActive : ''}`}
            >
              {autoRefresh ? '🔄 En vivo' : '⏸️ Pausado'}
            </button>
          </div>

          {/* Camera List */}
          <div className={styles.cameraList}>
            {loading && cameras.length === 0 ? (
              <div className={styles.emptyState}>⏳ Cargando cámaras...</div>
            ) : filtered.length === 0 ? (
              <div className={styles.emptyState}>No hay cámaras para mostrar</div>
            ) : (
              filtered.sort((a, b) => statusConfig[a.status]?.priority - statusConfig[b.status]?.priority).map(cam => (
                <div
                  key={`${cam.id}-${cam.mac}`}
                  onClick={() => setSelectedCameraId(cam.id)}
                  className={`${styles.cameraRow} ${selectedCameraId === cam.id ? styles.cameraRowSelected : ''}`}
                  style={{
                    borderLeftColor: statusConfig[cam.status]?.color || '#888',
                  }}
                >
                  <div
                    className={styles.cameraDot}
                    style={{ background: statusConfig[cam.status]?.color || '#888' }}
                  />
                  
                  <div className={styles.cameraInfo}>
                    <p className={styles.cameraName}>#{cam.id} {cam.name}</p>
                    <p className={styles.cameraDetails}>{cam.ip} • {cam.mac}</p>
                  </div>

                  <div className={styles.cameraStatus}>
                    <p className={styles.statusLabel}>{statusConfig[cam.status]?.label}</p>
                    {notes[cam.id] && <p className={styles.notesCount}>{notes[cam.id].length} nota(s)</p>}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <p>📡 Última actualización: {lastUpdate.toLocaleTimeString('es-AR')}</p>
            {autoRefresh && <p>🔄 Actualizando cada 15 segundos</p>}
          </div>
        </div>
      </div>

      {/* Right Panel - Notes */}
      <div className={styles.notesPanel}>
        {selectedCamera ? (
          <>
            {/* Camera Info */}
            <div className={styles.notesPanelHeader}>
              <div className={styles.notesCameraInfo}>
                <div
                  className={styles.notesCameraDot}
                  style={{ background: statusConfig[selectedCamera.status]?.color || '#888' }}
                />
                <h2>#{selectedCamera.id} {selectedCamera.name}</h2>
              </div>
              <p className={styles.notesCameraStatus}>{selectedCamera.ip}</p>
              <p className={styles.notesCameraLabel}>{statusConfig[selectedCamera.status]?.label}</p>
            </div>

            {/* Add Note */}
            <div className={styles.addNoteSection}>
              <p className={styles.addNoteLabel}>Agregar nota</p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Describe el problema o acción realizada..."
                className={styles.noteTextarea}
                rows="3"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className={styles.noteSaveBtn}
              >
                Guardar nota
              </button>
            </div>

            {/* Notes List */}
            <div className={styles.notesListSection}>
              <p className={styles.notesListLabel}>Historial ({cameraNotesDisplay.length})</p>
              {cameraNotesDisplay.length === 0 ? (
                <p className={styles.emptyNotes}>Sin notas aún</p>
              ) : (
                cameraNotesDisplay.map(note => (
                  <div key={note.id} className={styles.noteItem}>
                    <div className={styles.noteItemHeader}>
                      <p className={styles.noteItemText}>{note.text}</p>
                      <button
                        onClick={() => handleDeleteNote(selectedCamera.id, note.id)}
                        className={styles.noteDeleteBtn}
                      >
                        ✕
                      </button>
                    </div>
                    <p className={styles.noteItemTime}>{note.timestamp}</p>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className={styles.notesEmptyState}>
            <p>Selecciona una cámara para ver o agregar notas</p>
          </div>
        )}
      </div>
    </div>
  );
}
