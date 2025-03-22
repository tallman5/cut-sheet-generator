import React, { useEffect, useState } from "react";
import { HeadFC } from "gatsby";
import { generateCutSheetsAsync, generateCutSheetSvgAsync, GrainDirection, IGeneratorConfig, IGeneratorResult, IPanel } from "../cut-sheet-generator";
import { EnumDropdown } from '@tallman5/core-react';

const IndexPage = () => {
  const [generatorConfig, setGeneratorConfig] = useState<IGeneratorConfig>({
    projectName: "Project 1",
    pieces: [
      { length: 22.25, width: 20, quantity: 24, grainDirection: GrainDirection.Length },
    ],
    stockMaterials: [
      { length: 96, width: 48, quantity: 8, grainDirection: GrainDirection.Length },
    ],
    kerf: 0.125,
    considerGrain: true,
  });
  const [generatorResult, setGeneratorResult] = useState<IGeneratorResult | null>(null);
  const [svg, setSvg] = useState<string>("");

  const updateConfig = (key: keyof IGeneratorConfig, index: number, field: keyof IPanel, value: any) => {
    setGeneratorConfig((prevConfig) => {
      const updatedArray = [...(prevConfig[key] as IPanel[])];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return { ...prevConfig, [key]: updatedArray };
    });
  };

  const addItem = (key: keyof IGeneratorConfig) => {
    setGeneratorConfig((prevConfig) => ({
      ...prevConfig,
      [key]: [...(prevConfig[key] as IPanel[]), { length: 0, width: 0, quantity: 1, grainDirection: GrainDirection.Length }],
    }));
  };


  const removeItem = (key: keyof IGeneratorConfig, index: number) => {
    setGeneratorConfig((prevConfig) => {
      const updatedArray = (prevConfig[key] as IPanel[]).filter((_, i) => i !== index);
      return { ...prevConfig, [key]: updatedArray };
    });
  };

  useEffect(() => {
    async function updateCutSheets() {
      const result: IGeneratorResult = await generateCutSheetsAsync(generatorConfig);
      setGeneratorResult(result);
    }
    updateCutSheets();
  }, [generatorConfig]);

  useEffect(() => {
    async function updateSvg() {
      if (!generatorResult) return;
      const newSvg = await generateCutSheetSvgAsync(generatorConfig.stockMaterials, generatorResult.layout);
      setSvg(newSvg);
    }
    updateSvg();
  }, [generatorResult]);

  return (
    <div className="vh-100 d-flex flex-column">
      <div className="py-3">
        <div className="container">
          <div className="row">
            <div className="col">
              <h1>Cut Sheet Generator</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow-1 d-flex">
        <div className="border p-2 overflow-auto">
          <h2 className="fs-6">Panels</h2>
          {generatorConfig.pieces.map((panel, index) => (
            <div key={index} className="d-flex gap-1 mb-1">
              <input type="number" defaultValue={panel.length} onChange={(e) => updateConfig("pieces", index, "length", parseFloat(e.target.value))} className="form-control form-control-sm" placeholder="L" />
              <input type="number" defaultValue={panel.width} onChange={(e) => updateConfig("pieces", index, "width", parseFloat(e.target.value))} className="form-control form-control-sm" placeholder="W" />
              <input type="number" defaultValue={panel.quantity} onChange={(e) => updateConfig("pieces", index, "quantity", parseInt(e.target.value))} className="form-control form-control-sm" placeholder="Q" />
              <EnumDropdown enumObject={GrainDirection} defaultValue={panel.grainDirection} onEnumChanged={(value) => updateConfig("pieces", index, "grainDirection", value)} className="form-control form-control-sm" />
              <button onClick={() => removeItem("pieces", index)} className="btn btn-danger btn-sm">&times;</button>
            </div>
          ))}
          <button onClick={() => addItem("pieces")} className="btn btn-primary btn-sm">Add</button>

          <hr/>

          <h2 className="fs-6 mt-2">Stock</h2>
          {generatorConfig.stockMaterials.map((stock, index) => (
            <div key={index} className="d-flex gap-1 mb-1">
              <input type="number" defaultValue={stock.length} onChange={(e) => updateConfig("stockMaterials", index, "length", parseFloat(e.target.value))} className="form-control form-control-sm" placeholder="L" />
              <input type="number" defaultValue={stock.width} onChange={(e) => updateConfig("stockMaterials", index, "width", parseFloat(e.target.value))} className="form-control form-control-sm" placeholder="W" />
              <input type="number" defaultValue={stock.quantity} onChange={(e) => updateConfig("stockMaterials", index, "quantity", parseInt(e.target.value))} className="form-control form-control-sm" placeholder="Q" />
              <EnumDropdown enumObject={GrainDirection} defaultValue={stock.grainDirection} onEnumChanged={(value) => updateConfig("stockMaterials", index, "grainDirection", value)} className="form-control form-control-sm" />
              <button onClick={() => removeItem("stockMaterials", index)} className="btn btn-danger btn-sm">&times;</button>
            </div>
          ))}
          <button onClick={() => addItem("stockMaterials")} className="btn btn-primary btn-sm">Add</button>

          <hr/>

          <h2 className="fs-6 mt-2">Settings</h2>
          <div className="form-floating">
            <input
              type="text"
              className="form-control form-control-sm"
              id="kerfInput"
              placeholder="Kerf"
              value={generatorConfig.kerf}
              onChange={(e) => setGeneratorConfig({ ...generatorConfig, kerf: parseFloat(e.target.value) })}
            />
            <label htmlFor="kerfInput">Kerf</label>
          </div>
          <div className="form-check form-switch form-check-reverse mt-1">
            <input
              className="form-check-input"
              type="checkbox"
              id="grainSwitch"
              onChange={(e) => setGeneratorConfig({ ...generatorConfig, considerGrain: e.target.checked })}
              checked={generatorConfig.considerGrain}
            />
            <label className="form-check-label" htmlFor="grainSwitch">Consider Grain</label>
          </div>
        </div>
        <div className="flex-fill border p-2 overflow-auto">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <div style={{ width: "100%", height: "100%" }}>
              <div dangerouslySetInnerHTML={{ __html: svg }} style={{ width: "100%", height: "100%", border: "1px solid red" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
export const Head: HeadFC = () => <title>Home Page</title>;
