import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  Eye,
  FileText,
  Info,
  Shield,
  Sparkles,
  Sun,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { OPTICAL_LENS_OPTIONS, SUNGLASSES_LENS_OPTIONS } from '../../data/mockData';
import { LensOption, PrescriptionDetails, ProductColor } from '../../types';
import { EyewearArtwork } from '../common/EyewearArtwork';

export const LensSelectionModal: React.FC = () => {
  const {
    lensConfigProduct,
    setLensConfigProduct,
    editingCartItem,
    setEditingCartItem,
    addToCart,
    updateCartItemLens,
  } = useShop();

  const product = lensConfigProduct || editingCartItem?.product;

  const isOptical = product?.isOptical ?? true;
  const availableLensOptions = isOptical ? OPTICAL_LENS_OPTIONS : SUNGLASSES_LENS_OPTIONS;

  // Selected State
  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    if (editingCartItem) return editingCartItem.selectedColor;
    return product?.colors[0] || { name: 'Champagne Gold', hex: '#C6A15B' };
  });

  const [selectedLens, setSelectedLens] = useState<LensOption>(() => {
    if (editingCartItem) return editingCartItem.selectedLens;
    // Default to Blue Cut for optical or Polarized for sunglasses if available, else first
    return (
      availableLensOptions.find((l) => l.id.includes('blue-cut')) || availableLensOptions[0]
    );
  });

  const [prescriptionType, setPrescriptionType] = useState<
    'non-prescription' | 'single-vision' | 'bifocal' | 'progressive'
  >(() => {
    return editingCartItem?.prescriptionDetails?.prescriptionType || 'single-vision';
  });

  const [lensIndex, setLensIndex] = useState<
    '1.56 Standard' | '1.61 Thin' | '1.67 Ultra Thin' | '1.74 High Index'
  >(() => {
    return editingCartItem?.prescriptionDetails?.lensIndex || '1.61 Thin';
  });

  // Manual Prescription Form
  const [odSphere, setOdSphere] = useState(editingCartItem?.prescriptionDetails?.odSphere || '');
  const [odCyl, setOdCyl] = useState(editingCartItem?.prescriptionDetails?.odCyl || '');
  const [odAxis, setOdAxis] = useState(editingCartItem?.prescriptionDetails?.odAxis || '');
  const [osSphere, setOsSphere] = useState(editingCartItem?.prescriptionDetails?.osSphere || '');
  const [osCyl, setOsCyl] = useState(editingCartItem?.prescriptionDetails?.osCyl || '');
  const [osAxis, setOsAxis] = useState(editingCartItem?.prescriptionDetails?.osAxis || '');
  const [pd, setPd] = useState(editingCartItem?.prescriptionDetails?.pd || '63');
  const [addPower, setAddPower] = useState(editingCartItem?.prescriptionDetails?.addPower || '');
  const [notes, setNotes] = useState(editingCartItem?.prescriptionDetails?.notes || '');

  // File Upload
  const [uploadedFileName, setUploadedFileName] = useState(
    editingCartItem?.prescriptionDetails?.uploadedFileName || ''
  );
  const [uploadedDataUrl, setUploadedDataUrl] = useState(
    editingCartItem?.prescriptionDetails?.uploadedFileDataUrl || ''
  );
  const [activeTab, setActiveTab] = useState<'lenses' | 'prescription'>('lenses');

  if (!product) return null;

  const closeModal = () => {
    setLensConfigProduct(null);
    setEditingCartItem(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedDataUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Live updated total price
  const framePrice = product.price;
  const lensAdditional = selectedLens.additionalPrice;
  const totalItemPrice = framePrice + lensAdditional;

  const handleConfirm = () => {
    const prescriptionDetails: PrescriptionDetails = {
      prescriptionType,
      lensIndex,
      odSphere,
      odCyl,
      odAxis,
      osSphere,
      osCyl,
      osAxis,
      pd,
      addPower: selectedLens.id.includes('progressive') ? addPower : undefined,
      notes,
      uploadedFileName,
      uploadedFileDataUrl: uploadedDataUrl,
    };

    if (editingCartItem) {
      updateCartItemLens(editingCartItem.id, selectedLens, prescriptionDetails);
    } else {
      addToCart(product, selectedColor, selectedLens, prescriptionDetails, 1);
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E7E5E0]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E0] bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
              Bespoke Optics Studio
            </span>
            <span className="text-stone-300">·</span>
            <h2 className="text-base sm:text-lg font-serif font-semibold text-[#222222]">
              {editingCartItem ? 'Edit Lens Configuration' : 'Choose Your Precision Lenses'}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#FAF8F5] border-b border-[#EBE7DF] text-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-10 rounded-lg overflow-hidden border border-[#E5DFD5]">
              <EyewearArtwork
                shape={product.frameShape}
                color={selectedColor}
                isOptical={product.isOptical}
                customImageUrl={product.customImageUrl}
              />
            </div>
            <div>
              <p className="font-medium text-[#222222]">{product.name}</p>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>{selectedColor.name}</span>
                <span>·</span>
                <span>Base Frame: ${product.price}</span>
              </div>
            </div>
          </div>

          {/* Color Switcher */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-stone-500 mr-1">Frame Finish:</span>
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c)}
                title={c.name}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColor.name === c.name
                    ? 'border-[#C6A15B] scale-110 shadow-sm'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E7E5E0] bg-white px-6">
          <button
            onClick={() => setActiveTab('lenses')}
            className={`py-3 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'lenses'
                ? 'border-[#C6A15B] text-[#C6A15B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. Select Lens Type ({availableLensOptions.length} Options)
          </button>
          <button
            onClick={() => setActiveTab('prescription')}
            className={`py-3 px-4 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'prescription'
                ? 'border-[#C6A15B] text-[#C6A15B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. Prescription & Index (Optional)
            {uploadedFileName && <span className="w-2 h-2 rounded-full bg-[#C6A15B]" />}
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'lenses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-stone-600">
                  Select your lens package. Each lens is precision-surfaced in our cleanroom optical lab.
                </p>
                <span className="text-xs text-stone-400 font-medium">All include anti-scratch warranty</span>
              </div>

              {/* Lens Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {availableLensOptions.map((lens) => {
                  const isSelected = selectedLens.id === lens.id;
                  return (
                    <div
                      key={lens.id}
                      onClick={() => setSelectedLens(lens)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#C6A15B] bg-[#FFFDF9] shadow-md shadow-[#C6A15B]/10'
                          : 'border-[#E7E5E0] hover:border-stone-300 bg-white hover:bg-stone-50/50'
                      }`}
                    >
                      {lens.badge && (
                        <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C6A15B]/15 text-[#8F6F30]">
                          {lens.badge}
                        </span>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 pr-12">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                isSelected ? 'border-[#C6A15B] bg-[#C6A15B] text-white' : 'border-stone-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <h3 className="font-semibold text-sm text-[#222222]">{lens.name}</h3>
                          </div>
                          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                            {lens.description}
                          </p>

                          {/* Feature tags */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {lens.features.map((feat, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right whitespace-nowrap">
                          <span className="text-sm font-bold text-[#222222]">
                            {lens.additionalPrice === 0 ? 'Free' : `+$${lens.additionalPrice}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'prescription' && (
            <div className="space-y-6">
              {/* Prescription Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Vision Correction Need
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'non-prescription', label: 'Plano (Zero Rx)', desc: 'Fashion / Screen only' },
                    { id: 'single-vision', label: 'Single Vision', desc: 'Distance or Reading' },
                    { id: 'bifocal', label: 'Bifocal', desc: 'Dual field with line' },
                    { id: 'progressive', label: 'Progressive', desc: 'Smooth multifocal' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPrescriptionType(t.id as any)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        prescriptionType === t.id
                          ? 'border-[#C6A15B] bg-[#FFFDF9] ring-1 ring-[#C6A15B]'
                          : 'border-[#E7E5E0] hover:bg-stone-50'
                      }`}
                    >
                      <p className="text-xs font-semibold text-[#222222]">{t.label}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lens Index Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Refractive Lens Index (Thickness)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: '1.56 Standard', label: '1.56 Standard', rec: 'Up to ±2.00 SPH' },
                    { id: '1.61 Thin', label: '1.61 Thin', rec: '±2.00 to ±4.00 SPH' },
                    { id: '1.67 Ultra Thin', label: '1.67 Ultra Thin', rec: '±4.00 to ±7.00 SPH' },
                    { id: '1.74 High Index', label: '1.74 Super High', rec: 'Above ±7.00 SPH' },
                  ].map((idx) => (
                    <button
                      key={idx.id}
                      type="button"
                      onClick={() => setLensIndex(idx.id as any)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        lensIndex === idx.id
                          ? 'border-[#C6A15B] bg-[#FFFDF9] ring-1 ring-[#C6A15B]'
                          : 'border-[#E7E5E0] hover:bg-stone-50'
                      }`}
                    >
                      <p className="text-xs font-semibold text-[#222222]">{idx.label}</p>
                      <p className="text-[11px] text-[#C6A15B] font-medium mt-0.5">{idx.rec}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prescription Upload OR Manual Entry */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Method A: Upload Doctor's Slip */}
                <div className="p-4 rounded-xl border border-dashed border-[#C6A15B]/60 bg-[#FAF9F5] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-[#C6A15B]">
                      <Upload className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#222222]">
                        Option A: Upload Prescription
                      </h4>
                    </div>
                    <p className="text-xs text-stone-500 mb-4">
                      Snap a photo of your doctor's optometrist slip. Our licensed opticians will verify and calibrate.
                    </p>
                  </div>

                  <div>
                    <label className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-[#E7E5E0] hover:border-[#C6A15B] cursor-pointer transition-colors group">
                      <FileText className="w-6 h-6 text-stone-400 group-hover:text-[#C6A15B] mb-2 transition-colors" />
                      <span className="text-xs font-medium text-[#222222]">
                        {uploadedFileName ? uploadedFileName : 'Choose file or drag & drop'}
                      </span>
                      <span className="text-[10px] text-stone-400 mt-0.5">JPG, PNG, PDF up to 10MB</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {uploadedFileName && (
                      <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded mt-2">
                        <span>✓ File uploaded successfully</span>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFileName('');
                            setUploadedDataUrl('');
                          }}
                          className="text-stone-400 hover:text-stone-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Method B: Manual Prescription Matrix */}
                <div className="p-4 rounded-xl border border-[#E7E5E0] bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-stone-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#222222]">
                      Option B: Manual Values
                    </h4>
                  </div>
                  <p className="text-xs text-stone-500 mb-3">
                    Enter the Sphere (SPH), Cylinder (CYL), Axis, and Pupillary Distance (PD).
                  </p>

                  <div className="space-y-3">
                    {/* Right Eye (OD) */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="font-semibold text-stone-600 pt-2">Right (OD)</div>
                      <div>
                        <input
                          type="text"
                          placeholder="SPH -2.00"
                          value={odSphere}
                          onChange={(e) => setOdSphere(e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#E7E5E0] rounded text-center focus:border-[#C6A15B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="CYL -0.50"
                          value={odCyl}
                          onChange={(e) => setOdCyl(e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#E7E5E0] rounded text-center focus:border-[#C6A15B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="AXIS 180"
                          value={odAxis}
                          onChange={(e) => setOdAxis(e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#E7E5E0] rounded text-center focus:border-[#C6A15B] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Left Eye (OS) */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="font-semibold text-stone-600 pt-2">Left (OS)</div>
                      <div>
                        <input
                          type="text"
                          placeholder="SPH -1.75"
                          value={osSphere}
                          onChange={(e) => setOsSphere(e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#E7E5E0] rounded text-center focus:border-[#C6A15B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="CYL 0.00"
                          value={osCyl}
                          onChange={(e) => setOsCyl(e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#E7E5E0] rounded text-center focus:border-[#C6A15B] focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="AXIS 0"
                          value={osAxis}
                          onChange={(e) => setOsAxis(e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#E7E5E0] rounded text-center focus:border-[#C6A15B] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* PD and Progressive Add */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <label className="text-[11px] text-stone-500 block mb-1">
                          Pupillary Distance (PD mm)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 62 or 64"
                          value={pd}
                          onChange={(e) => setPd(e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#E7E5E0] rounded focus:border-[#C6A15B] focus:outline-none"
                        />
                      </div>
                      {selectedLens.id.includes('progressive') && (
                        <div>
                          <label className="text-[11px] text-stone-500 block mb-1">
                            ADD Power (+1.00 to +3.00)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. +1.75"
                            value={addPower}
                            onChange={(e) => setAddPower(e.target.value)}
                            className="w-full px-2 py-1.5 border border-[#E7E5E0] rounded focus:border-[#C6A15B] focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Real-Time Total Price Calculation */}
        <div className="p-4 sm:p-6 bg-[#FAF9F6] border-t border-[#E7E5E0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <p className="text-[11px] text-stone-500 uppercase tracking-wider">
                Total (Frame + Selected Lenses)
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-serif font-bold text-[#222222]">
                  ${totalItemPrice}
                </span>
                <span className="text-xs text-stone-500">
                  (${framePrice} frame + ${lensAdditional} lens)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-semibold text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{editingCartItem ? 'Update Cart' : 'Add to Shopping Bag'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
