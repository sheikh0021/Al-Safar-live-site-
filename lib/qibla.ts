const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

const toRadians = (degrees: number) => degrees * (Math.PI / 180);

export function calculateQiblaBearing(latitude: number, longitude: number) {
  const userLatitude = toRadians(latitude);
  const kaabaLatitude = toRadians(KAABA_LATITUDE);
  const longitudeDifference = toRadians(KAABA_LONGITUDE - longitude);

  const y = Math.sin(longitudeDifference) * Math.cos(kaabaLatitude);
  const x = Math.cos(userLatitude) * Math.sin(kaabaLatitude) -
    Math.sin(userLatitude) * Math.cos(kaabaLatitude) * Math.cos(longitudeDifference);

  return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
}

export function bearingToCardinal(bearing: number) {
  const directions = ["North", "North-east", "East", "South-east", "South", "South-west", "West", "North-west"];
  return directions[Math.round(bearing / 45) % directions.length];
}
