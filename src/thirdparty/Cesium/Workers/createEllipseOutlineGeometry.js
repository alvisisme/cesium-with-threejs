/* This file is automatically rebuilt by the Cesium build process. */
define(['./Cartesian2-44e93af5', './when-f31b6bd1', './EllipseOutlineGeometry-048fc81b', './Check-285f6bfc', './Math-8c161f1c', './GeometryOffsetAttribute-4b098ee5', './Transforms-eb995198', './RuntimeError-c7c236f3', './ComponentDatatype-d4a0149c', './WebGLConstants-34c08bc0', './EllipseGeometryLibrary-03b88f80', './GeometryAttribute-cc0565cd', './GeometryAttributes-e973821e', './IndexDatatype-e20e62f1'], function (Cartesian2, when, EllipseOutlineGeometry, Check, _Math, GeometryOffsetAttribute, Transforms, RuntimeError, ComponentDatatype, WebGLConstants, EllipseGeometryLibrary, GeometryAttribute, GeometryAttributes, IndexDatatype) { 'use strict';

  function createEllipseOutlineGeometry(ellipseGeometry, offset) {
    if (when.defined(offset)) {
      ellipseGeometry = EllipseOutlineGeometry.EllipseOutlineGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Cartesian2.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseOutlineGeometry.EllipseOutlineGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseOutlineGeometry;

});
