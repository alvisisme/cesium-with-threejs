/* This file is automatically rebuilt by the Cesium build process. */
define(['./CylinderGeometry-aa2bc4a6', './when-f31b6bd1', './GeometryOffsetAttribute-4b098ee5', './Check-285f6bfc', './Transforms-eb995198', './Cartesian2-44e93af5', './Math-8c161f1c', './RuntimeError-c7c236f3', './ComponentDatatype-d4a0149c', './WebGLConstants-34c08bc0', './CylinderGeometryLibrary-d1e833de', './GeometryAttribute-cc0565cd', './GeometryAttributes-e973821e', './IndexDatatype-e20e62f1', './VertexFormat-ab7dd48c'], function (CylinderGeometry, when, GeometryOffsetAttribute, Check, Transforms, Cartesian2, _Math, RuntimeError, ComponentDatatype, WebGLConstants, CylinderGeometryLibrary, GeometryAttribute, GeometryAttributes, IndexDatatype, VertexFormat) { 'use strict';

  function createCylinderGeometry(cylinderGeometry, offset) {
    if (when.defined(offset)) {
      cylinderGeometry = CylinderGeometry.CylinderGeometry.unpack(cylinderGeometry, offset);
    }
    return CylinderGeometry.CylinderGeometry.createGeometry(cylinderGeometry);
  }

  return createCylinderGeometry;

});
