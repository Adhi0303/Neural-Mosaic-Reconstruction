import { useState } from 'react';
import './index.css';

function App() {
  const [contentFile, setContentFile] = useState(null);
  const [contentPreview, setContentPreview] = useState(null);
  const [styleFile, setStyleFile] = useState(null);
  const [stylePreview, setStylePreview] = useState(null);
  const [engine, setEngine] = useState('block_sorter');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!contentFile || !styleFile) return;
    
    setIsGenerating(true);
    setResultImage(null);

    const formData = new FormData();
    formData.append('content_image', contentFile);
    formData.append('style_image', styleFile);
    formData.append('engine', engine);

    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Generation failed');

      const blob = await response.blob();
      setResultImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Ensure FastAPI backend is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="gallery-layout">
      <header className="gallery-header">
        <h1>Neural Mosaic</h1>
        <div className="subtitle">An Interactive AI Art Exhibition</div>
      </header>
      
      <div className="app-container">
        {/* Left Control Panel */}
        <aside className="control-panel glass-panel">
          
          <div className="engine-selector">
            <h3>Exhibition Style</h3>
            <select value={engine} onChange={(e) => setEngine(e.target.value)}>
              <option value="mosaic">KD-Tree Patch Mosaic</option>
              <option value="pixel_sorter">Exact Pixel Sorter</option>
              <option value="block_sorter">1-to-1 Block Sorter</option>
              <option value="neural">Neural Style Transfer</option>
            </select>
          </div>

          <div className="upload-container">
            <label className="upload-zone">
              {contentPreview && <img src={contentPreview} alt="Content" className="preview-image" />}
              <div className="upload-text">
                <h3>Subject</h3>
                <p>Select your canvas</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={(e) => handleFileChange(e, setContentFile, setContentPreview)} 
              />
            </label>

            <label className="upload-zone">
              {stylePreview && <img src={stylePreview} alt="Style" className="preview-image" />}
              <div className="upload-text">
                <h3>Inspiration</h3>
                <p>Select the palette</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={(e) => handleFileChange(e, setStyleFile, setStylePreview)} 
              />
            </label>
          </div>

          <button 
            className="generate-btn" 
            onClick={handleGenerate}
            disabled={!contentFile || !styleFile || isGenerating}
          >
            {isGenerating ? 'Curating...' : 'Unveil Masterpiece'}
          </button>
        </aside>

        {/* Right Output Panel */}
        <main className="output-panel">
          <div className="artwork-frame">
            {isGenerating ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p className="placeholder-text">Synthesizing Artwork...</p>
              </div>
            ) : resultImage ? (
              <>
                <img src={resultImage} alt="Generated Art" className="output-image artwork" />
                <div className="artwork-plaque">
                  <h2 className="plaque-title">Untitled Synthesis</h2>
                  <p className="plaque-artist">by Neural Mosaic AI</p>
                  <p className="plaque-desc">Engine: {engine.replace('_', ' ').toUpperCase()}</p>
                </div>
              </>
            ) : (
              <div className="placeholder-text">The canvas awaits your vision</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
