import React from 'react';
import { Check, Layers, ShoppingBag, Trash2, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { EyewearArtwork } from '../common/EyewearArtwork';

export const ProductCompareModal: React.FC = () => {
  const {
    compareList,
    compareModalOpen,
    setCompareModalOpen,
    removeFromCompare,
    setLensConfigProduct,
  } = useShop();

  if (!compareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E7E5E0] my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E0] bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#C6A15B]" />
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#222222]">
              Eyewear Specification Comparison
            </h2>
            <span className="text-xs text-stone-500 font-medium">({compareList.length} of 4)</span>
          </div>
          <button
            onClick={() => setCompareModalOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="p-6 overflow-x-auto">
          {compareList.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-400">
              <Layers className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-1" />
              <p>No products currently in comparison.</p>
              <p className="text-stone-500 mt-1">
                Click the compare icon on any product card to evaluate frame geometries side-by-side.
              </p>
            </div>
          ) : (
            <div className="min-w-[600px]">
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `160px repeat(${compareList.length}, minmax(180px, 1fr))`,
                }}
              >
                {/* Row 1: Header / Artwork */}
                <div className="font-semibold text-xs text-stone-400 uppercase tracking-wider pt-12">
                  Model
                </div>
                {compareList.map((product) => (
                  <div key={product.id} className="relative p-3 bg-[#FAF9F6] rounded-xl border border-[#E7E5E0] flex flex-col items-center text-center">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-2 right-2 p-1 text-stone-400 hover:text-rose-500"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-28 h-20 overflow-hidden my-2">
                      <EyewearArtwork
                        shape={product.frameShape}
                        color={product.colors[0]}
                        isOptical={product.isOptical}
                        customImageUrl={product.customImageUrl}
                      />
                    </div>
                    <span className="text-[10px] text-[#C6A15B] font-semibold uppercase">{product.brand}</span>
                    <h4 className="text-xs font-bold text-stone-900 mt-0.5 line-clamp-1">{product.name}</h4>
                    <span className="text-sm font-serif font-bold text-stone-800 mt-1">${product.price}</span>
                  </div>
                ))}

                {/* Row 2: Frame Shape */}
                <div className="font-semibold text-xs text-stone-600 py-2 border-t">Shape</div>
                {compareList.map((p) => (
                  <div key={p.id} className="text-xs text-stone-800 py-2 border-t text-center font-medium">
                    {p.frameShape}
                  </div>
                ))}

                {/* Row 3: Material */}
                <div className="font-semibold text-xs text-stone-600 py-2 border-t">Material</div>
                {compareList.map((p) => (
                  <div key={p.id} className="text-xs text-stone-800 py-2 border-t text-center">
                    {p.frameMaterial}
                  </div>
                ))}

                {/* Row 4: Dimensions */}
                <div className="font-semibold text-xs text-stone-600 py-2 border-t">Dimensions</div>
                {compareList.map((p) => (
                  <div key={p.id} className="text-xs text-stone-800 py-2 border-t text-center">
                    {p.dimensions.lensWidth}-{p.dimensions.bridgeWidth}-{p.dimensions.templeLength} mm
                  </div>
                ))}

                {/* Row 5: Weight */}
                <div className="font-semibold text-xs text-stone-600 py-2 border-t">Weight</div>
                {compareList.map((p) => (
                  <div key={p.id} className="text-xs text-stone-800 py-2 border-t text-center">
                    {p.weight}
                  </div>
                ))}

                {/* Row 6: Gender */}
                <div className="font-semibold text-xs text-stone-600 py-2 border-t">Gender</div>
                {compareList.map((p) => (
                  <div key={p.id} className="text-xs text-stone-800 py-2 border-t text-center">
                    {p.gender}
                  </div>
                ))}

                {/* Row 7: Optical Lenses */}
                <div className="font-semibold text-xs text-stone-600 py-2 border-t">Prescription Lab</div>
                {compareList.map((p) => (
                  <div key={p.id} className="text-xs text-stone-800 py-2 border-t text-center">
                    {p.isOptical ? 'Full Rx Support' : 'Sun / Plano Optics'}
                  </div>
                ))}

                {/* Row 8: Action */}
                <div className="py-3 border-t"></div>
                {compareList.map((p) => (
                  <div key={p.id} className="py-3 border-t text-center">
                    <button
                      onClick={() => {
                        setCompareModalOpen(false);
                        setLensConfigProduct(p);
                      }}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Configure</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
