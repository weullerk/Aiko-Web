export interface PointOfInterest {
  id: string,
  coordinates: string,
  description: string
}

export interface PointOfInterestWithoutIdentifier {
  coordinates: string,
  description: string
}

export interface PrettyCoordinates {
  coordinateX: number,
  coordinateY: number,
  zoomLevel: string,
  description: string
}
