import PORTICO_2N_SPEC from "./portico2nSpec.json";

export { PORTICO_2N_SPEC };

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Calcula las cantidades paramétricas exactas desde portico2nSpec.json
 * en coincidencia 1:1 con el visor 3D BIM y el presupuesto de Gerencia.
 */
export function computePorticoTakeoffs() {
  const s = PORTICO_2N_SPEC;

  let footingConcreteM3 = 0;
  for (const item of s.footings.items) {
    const t = s.footings.types[item.type];
    footingConcreteM3 += t.b * t.b * t.h;
  }

  const pedH = Math.abs(s.levels.gradeBeamTop - s.levels.footingTop);
  const pedestalConcreteM3 = s.footings.items.length * s.pedestal.b * s.pedestal.b * pedH;

  const vcSpec = s.beamTypes.VC;
  let gradeBeamLen = 0;
  for (const bm of s.beams.filter((b) => b.type === "VC")) {
    const gross = Math.abs(bm.to - bm.from);
    const ded = bm.supports.length * s.pedestal.b;
    gradeBeamLen += Math.max(0, gross - ded);
  }
  const gradeBeamConcreteM3 = gradeBeamLen * vcSpec.b * vcSpec.h;

  const gs = s.slabs.groundSlab;
  const groundSlabAreaM2 = (gs.x1 - gs.x0) * (gs.z1 - gs.z0);
  const groundSlabConcreteM3 = groundSlabAreaM2 * gs.thickness;

  let colNetLen = 0;
  for (const c of s.columns.items) {
    colNetLen += Math.max(0, c.top - s.levels.gradeBeamTop);
  }
  const columnConcreteM3 = colNetLen * s.columns.b * s.columns.b;

  const veSpec = s.beamTypes.VE;
  let veNetLen = 0;
  for (const bm of s.beams.filter((b) => b.type === "VE")) {
    const ded = bm.supports.length * s.columns.b;
    veNetLen += Math.max(0, Math.abs(bm.to - bm.from) - ded);
  }
  const floorBeamConcreteM3 = veNetLen * veSpec.b * veSpec.h;

  const vcuSpec = s.beamTypes.VCU;
  let vcuNetLen = 0;
  for (const bm of s.beams.filter((b) => b.type === "VCU")) {
    const ded = bm.supports.length * s.columns.b;
    vcuNetLen += Math.max(0, Math.abs(bm.to - bm.from) - ded);
  }
  const slopeRad = Math.atan2(s.levels.ridge - s.levels.eave, Math.abs(s.grid.z[0].pos));
  const cosSlope = Math.cos(slopeRad);
  const rafterHorizLen = Math.abs(s.rafters.frontEnd - s.rafters.rearEnd);
  const rafterSlopeLen = rafterHorizLen / cosSlope;
  const raftersLen = s.rafters.lines.length * (rafterSlopeLen - 0.35);
  const roofBeamConcreteM3 = (vcuNetLen + raftersLen) * vcuSpec.b * vcuSpec.h;

  const fs = s.slabs.floorSlab;
  const bal = s.slabs.balcony;
  const voidArea = (fs.void.x1 - fs.void.x0) * (fs.void.z1 - fs.void.z0);
  const floorSlabAreaM2 = (fs.x1 - fs.x0) * (fs.z1 - fs.z0) - voidArea;
  const balconyAreaM2 = (bal.x1 - bal.x0) * (bal.z1 - bal.z0);
  const floorSlabConcreteM3 = (floorSlabAreaM2 + balconyAreaM2) * fs.thickness;

  const st = s.stair;
  const flightHoriz = Math.abs(st.flight1.x1 - st.flight1.x0);
  const flightRise = st.flight1.y1 - st.flight1.y0;
  const waistSlopeLen = Math.hypot(flightHoriz, flightRise);
  const waistVol = 2 * (waistSlopeLen * st.waist * st.width);
  const stepTrianglesVol = st.risersPerFlight * 2 * (0.5 * st.tread * st.riser * st.width);
  const landingArea = (st.landing.x1 - st.landing.x0) * (st.landing.z1 - st.landing.z0);
  const landingVol = landingArea * (st.waist + 0.03);
  const stairConcreteM3 = waistVol + stepTrianglesVol + landingVol;

  let wallGrossArea = 0;
  let openingsArea = 0;
  let doorsCount = 0;
  let windowsCount = 0;
  for (const w of s.walls) {
    const len = Math.hypot(w.x2 - w.x1, w.z2 - w.z1);
    const underVeBeam =
      w.level === 1 &&
      (w.ext ||
        (Math.abs(w.z1 - w.z2) < 0.01 && Math.abs(w.z1) < 0.01) ||
        (Math.abs(w.x1 - w.x2) < 0.01 && Math.abs(w.x1) < 0.01));
    const hBase = w.level === 1 ? (underVeBeam ? 2.6 : 2.88) : 2.5;
    wallGrossArea += len * hBase;
    if (w.gable) {
      wallGrossArea += 0.5 * Math.abs(w.z2 - w.z1) * 0.72;
    }
    for (const op of w.openings) {
      openingsArea += op.w * (op.head - op.sill);
      if (op.kind === "window") windowsCount++;
      else doorsCount++;
    }
  }
  const masonryAreaM2 = Math.max(0, wallGrossArea - openingsArea);
  const plasterAreaM2 = masonryAreaM2 * 2;

  let flooringAreaM2 = 0;
  for (const r of s.rooms) {
    for (const [rx0, rz0, rx1, rz1] of r.rects) {
      flooringAreaM2 += Math.abs(rx1 - rx0) * Math.abs(rz1 - rz0);
    }
  }
  const c = s.roof.ceiling;
  const ceilingAreaM2 = (c.x1 - c.x0) * (c.z1 - c.z0) - voidArea * 0.85;

  const rf = s.roof;
  const roofWidthX = rf.x1 - rf.x0;
  const rearSlopeLen = Math.abs(rf.rearEdge) / cosSlope;
  const frontSlopeLen = Math.abs(rf.frontEdge) / cosSlope;
  const roofUpvcAreaM2 = roofWidthX * (rearSlopeLen + frontSlopeLen);

  const rearPurlins = Math.ceil(rearSlopeLen / rf.purlinMaxSpacing) + 1;
  const frontPurlins = Math.ceil(frontSlopeLen / rf.purlinMaxSpacing) + 1;
  const purlinCount = rearPurlins + frontPurlins;
  const purlinLengthMl = purlinCount * roofWidthX;

  return {
    foundationConcreteM3: round2(footingConcreteM3 + pedestalConcreteM3 + gradeBeamConcreteM3),
    groundSlabConcreteM3: round2(groundSlabConcreteM3),
    superstructureConcreteM3: round2(
      columnConcreteM3 + floorBeamConcreteM3 + roofBeamConcreteM3 + floorSlabConcreteM3 + stairConcreteM3
    ),
    masonryAreaM2: round2(masonryAreaM2),
    plasterAreaM2: round2(plasterAreaM2),
    flooringAreaM2: round2(flooringAreaM2),
    ceilingAreaM2: round2(ceilingAreaM2),
    roofUpvcAreaM2: round2(roofUpvcAreaM2),
    purlinLengthMl: round2(purlinLengthMl),
    openingsCount: doorsCount + windowsCount,
    wallPaintAreaM2: round2(plasterAreaM2),
  };
}
