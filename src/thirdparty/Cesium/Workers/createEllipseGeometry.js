/* This file is automatically rebuilt by the Cesium build process. */
define(['./Cartesian2-44e93af5', './when-f31b6bd1', './EllipseGeometry-a787774d', './Check-285f6bfc', './Math-8c161f1c', './GeometryOffsetAttribute-4b098ee5', './Transforms-eb995198', './RuntimeError-c7c236f3', './ComponentDatatype-d4a0149c', './WebGLConstants-34c08bc0', './EllipseGeometryLibrary-03b88f80', './GeometryAttribute-cc0565cd', './GeometryAttributes-e973821e', './GeometryInstance-3f5c1f37', './GeometryPipeline-83d68cb3', './AttributeCompression-e3a6496c', './EncodedCartesian3-58bad53b', './IndexDatatype-e20e62f1', './IntersectionTests-db497aaf', './Plane-16f95004', './VertexFormat-ab7dd48c'], function (Cartesian2, when, EllipseGeometry, Check, _Math, GeometryOffsetAttribute, Transforms, RuntimeError, ComponentDatatype, WebGLConstants, EllipseGeometryLibrary, GeometryAttribute, GeometryAttributes, GeometryInstance, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, VertexFormat) { 'use strict';

  function createEllipseGeometry(ellipseGeometry, offset) {
    if (when.defined(offset)) {
      ellipseGeometry = EllipseGeometry.EllipseGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Cartesian2.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseGeometry.EllipseGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseGeometry;

});
