import React, { useState } from 'react';
import { X, Ruler, MapPin } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide, sizeGuideCategory } = useShop();
  const [activeTab, setActiveTab] = useState<'helmets' | 'jackets' | 'gloves' | 'boots'>(() => {
    if (sizeGuideCategory.includes('helmet')) return 'helmets';
    if (sizeGuideCategory.includes('jacket') || sizeGuideCategory.includes('gear')) return 'jackets';
    if (sizeGuideCategory.includes('glove')) return 'gloves';
    if (sizeGuideCategory.includes('boot')) return 'boots';
    return 'helmets';
  });

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div 
        onClick={closeSizeGuide}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="min-h-screen px-4 flex items-center justify-center py-8">
        <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 text-neutral-900 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-950">Motorcycle Gear Size Chart</h3>
                <p className="text-xs text-neutral-500">Official measurement standards used by District 38 Trichy</p>
              </div>
            </div>
            <button
              onClick={closeSizeGuide}
              aria-label="Close size guide"
              className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 border-b border-neutral-200 mb-6 pb-2 overflow-x-auto">
            {(['helmets', 'jackets', 'gloves', 'boots'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all shrink-0 ${
                  activeTab === tab 
                    ? 'bg-neutral-950 text-white shadow-sm' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Content */}
          <div className="space-y-6">
            {activeTab === 'helmets' && (
              <div>
                <div className="mb-3 text-xs text-neutral-600 leading-relaxed">
                  Wrap a flexible measuring tape horizontally around your head, 1 inch (2.5 cm) above your eyebrows. If between sizes, size down for full-face helmets.
                </div>
                <div className="overflow-x-auto rounded-xl border border-neutral-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase border-b border-neutral-200">
                      <tr>
                        <th className="p-3">Size</th>
                        <th className="p-3">Head Circumference (CM)</th>
                        <th className="p-3">Head Circumference (Inches)</th>
                        <th className="p-3">Fit Profile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-800">
                      <tr>
                        <td className="p-3 font-bold">Small (S)</td>
                        <td className="p-3 font-mono">55 – 56 cm</td>
                        <td className="p-3 font-mono">21.6" – 22.0"</td>
                        <td className="p-3 text-neutral-500">Intermediate Oval</td>
                      </tr>
                      <tr className="bg-orange-50/30">
                        <td className="p-3 font-bold text-orange-600">Medium (M)</td>
                        <td className="p-3 font-mono font-bold">57 – 58 cm</td>
                        <td className="p-3 font-mono">22.4" – 22.8"</td>
                        <td className="p-3 text-neutral-500">Most Popular Indian Male Size</td>
                      </tr>
                      <tr className="bg-orange-50/30">
                        <td className="p-3 font-bold text-orange-600">Large (L)</td>
                        <td className="p-3 font-mono font-bold">59 – 60 cm</td>
                        <td className="p-3 font-mono">23.2" – 23.6"</td>
                        <td className="p-3 text-neutral-500">Standard Touring</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">X-Large (XL)</td>
                        <td className="p-3 font-mono">61 – 62 cm</td>
                        <td className="p-3 font-mono">24.0" – 24.4"</td>
                        <td className="p-3 text-neutral-500">Wide Crown</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">2X-Large (XXL)</td>
                        <td className="p-3 font-mono">63 – 64 cm</td>
                        <td className="p-3 font-mono">24.8" – 25.2"</td>
                        <td className="p-3 text-neutral-500">Extra Wide</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'jackets' && (
              <div>
                <div className="mb-3 text-xs text-neutral-600 leading-relaxed">
                  Measure around the fullest part of your chest under your armpits while keeping tape parallel to ground.
                </div>
                <div className="overflow-x-auto rounded-xl border border-neutral-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase border-b border-neutral-200">
                      <tr>
                        <th className="p-3">Size</th>
                        <th className="p-3">Chest (Inches)</th>
                        <th className="p-3">Waist (Inches)</th>
                        <th className="p-3">Sleeve Length (CM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-800">
                      <tr>
                        <td className="p-3 font-bold">S (38)</td>
                        <td className="p-3 font-mono">37" – 39"</td>
                        <td className="p-3 font-mono">30" – 32"</td>
                        <td className="p-3 font-mono">61 cm</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">M (40)</td>
                        <td className="p-3 font-mono">39" – 41"</td>
                        <td className="p-3 font-mono">32" – 34"</td>
                        <td className="p-3 font-mono">63 cm</td>
                      </tr>
                      <tr className="bg-neutral-50">
                        <td className="p-3 font-bold">L (42)</td>
                        <td className="p-3 font-mono font-bold">41" – 43"</td>
                        <td className="p-3 font-mono">34" – 36"</td>
                        <td className="p-3 font-mono">65 cm</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">XL (44)</td>
                        <td className="p-3 font-mono">43" – 45"</td>
                        <td className="p-3 font-mono">36" – 38"</td>
                        <td className="p-3 font-mono">67 cm</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">2XL (46)</td>
                        <td className="p-3 font-mono">45" – 48"</td>
                        <td className="p-3 font-mono">38" – 41"</td>
                        <td className="p-3 font-mono">69 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'gloves' && (
              <div>
                <div className="mb-3 text-xs text-neutral-600 leading-relaxed">
                  Measure palm circumference across the knuckles (excluding thumb) of your dominant throttle hand.
                </div>
                <div className="overflow-x-auto rounded-xl border border-neutral-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase border-b border-neutral-200">
                      <tr>
                        <th className="p-3">Size</th>
                        <th className="p-3">Palm Width (CM)</th>
                        <th className="p-3">Palm Circumference (Inches)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-800">
                      <tr>
                        <td className="p-3 font-bold">S</td>
                        <td className="p-3 font-mono">7.5 – 8.0 cm</td>
                        <td className="p-3 font-mono">7.0" – 7.5"</td>
                      </tr>
                      <tr className="bg-neutral-50">
                        <td className="p-3 font-bold">M</td>
                        <td className="p-3 font-mono">8.0 – 8.5 cm</td>
                        <td className="p-3 font-mono">7.5" – 8.2"</td>
                      </tr>
                      <tr className="bg-neutral-50">
                        <td className="p-3 font-bold">L</td>
                        <td className="p-3 font-mono font-bold">8.5 – 9.2 cm</td>
                        <td className="p-3 font-mono">8.2" – 9.0"</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">XL</td>
                        <td className="p-3 font-mono">9.2 – 9.8 cm</td>
                        <td className="p-3 font-mono">9.0" – 9.8"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'boots' && (
              <div>
                <div className="mb-3 text-xs text-neutral-600 leading-relaxed">
                  Motorcycle boots should fit snugly with riding socks. Check EU / UK sizing below:
                </div>
                <div className="overflow-x-auto rounded-xl border border-neutral-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase border-b border-neutral-200">
                      <tr>
                        <th className="p-3">EU Size</th>
                        <th className="p-3">UK / India Size</th>
                        <th className="p-3">US Size</th>
                        <th className="p-3">Foot Length (CM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-800">
                      <tr><td className="p-3 font-bold">EU 40</td><td className="p-3 font-mono font-bold">UK 6</td><td className="p-3">US 7</td><td className="p-3">25.5 cm</td></tr>
                      <tr><td className="p-3 font-bold">EU 41</td><td className="p-3 font-mono font-bold">UK 7</td><td className="p-3">US 8</td><td className="p-3">26.2 cm</td></tr>
                      <tr className="bg-neutral-50"><td className="p-3 font-bold">EU 42</td><td className="p-3 font-mono font-bold">UK 8</td><td className="p-3">US 9</td><td className="p-3">27.0 cm</td></tr>
                      <tr className="bg-neutral-50"><td className="p-3 font-bold">EU 43</td><td className="p-3 font-mono font-bold">UK 9</td><td className="p-3">US 10</td><td className="p-3">27.7 cm</td></tr>
                      <tr><td className="p-3 font-bold">EU 44</td><td className="p-3 font-mono font-bold">UK 10</td><td className="p-3">US 11</td><td className="p-3">28.5 cm</td></tr>
                      <tr><td className="p-3 font-bold">EU 45</td><td className="p-3 font-mono font-bold">UK 11</td><td className="p-3">US 12</td><td className="p-3">29.2 cm</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* In-store Guarantee Box */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-700">
                <span className="font-bold text-neutral-900 block mb-0.5">Still unsure about sizing?</span>
                Visit our Flagship Store for a <strong>free laser head measurement</strong> and trial on our motorcycle posture test rig. We also offer <strong>07-Day Size Exchanges</strong> with free reverse courier pickup.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
