import { CutSheetService } from "../src/cut-sheet-generator/cutSheetService";

describe("Cut Sheet Service", () => {
  let service: CutSheetService;

  beforeEach(() => {
    service = new CutSheetService();
  });

  test("should initialize with default values", () => {
    expect(service.stockMaterials).toEqual([]);
    expect(service.pieces).toEqual([]);
    expect(service.kerf).toBe(0.125);
    expect(service.considerGrain).toBe(true);
    expect(service.svgOutput).toBe("");
    expect(service.waste).toBe(0);
  });

  test("should update stock materials", async () => {
    service.setStockMaterials([{ length: 96, width: 48, quantity: 1 }]);
    await service.updateCutSheetAsync();
    expect(service.stockMaterials).toHaveLength(1);
  });

  test("should add and remove stock materials", async () => {
    service.addStockMaterial({ length: 96, width: 48, quantity: 1 });
    expect(service.stockMaterials).toHaveLength(1);
    service.deleteStockMaterial(0);
    expect(service.stockMaterials).toHaveLength(0);
  });

  test("should clear stock materials", async () => {
    service.addStockMaterial({ length: 96, width: 48, quantity: 1 });
    service.clearStockMaterials();
    expect(service.stockMaterials).toHaveLength(0);
  });

  test("should update pieces", async () => {
    service.setPieces([{ length: 24, width: 12, quantity: 2 }]);
    await service.updateCutSheetAsync();
    expect(service.pieces).toHaveLength(1);
  });

  test("should add and remove pieces", async () => {
    service.addPiece({ length: 24, width: 12, quantity: 2 });
    expect(service.pieces).toHaveLength(1);
    service.deletePiece(0);
    expect(service.pieces).toHaveLength(0);
  });

  test("should clear pieces", async () => {
    service.addPiece({ length: 24, width: 12, quantity: 2 });
    service.clearPieces();
    expect(service.pieces).toHaveLength(0);
  });

  test("should update kerf and considerGrain", async () => {
    service.setKerf(0.25);
    expect(service.kerf).toBe(0.25);
    service.setConsiderGrain(false);
    expect(service.considerGrain).toBe(false);
  });

  test("should notify listeners when updated", async () => {
    const listener = jest.fn();
    service.subscribe(listener);

    service.setStockMaterials([{ length: 96, width: 48, quantity: 1 }]);
    service.addPiece({ length: 24, width: 12, quantity: 2 });
    await service.updateCutSheetAsync();

    expect(listener).toHaveBeenCalled();
  });
});
