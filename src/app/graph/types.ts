export type Connection = {
  from: string,
  to: string,
  imageSrc: string
}

export type Node = {
  from: string,
  to: string,
}

export interface MyPoint extends Highcharts.Point {
  from: string,
  to: string,
  imageSrc: string;
}

export interface ProfilePic {
  ProfilePic: string
}