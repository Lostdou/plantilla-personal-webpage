export type ResourceImage = { src: string; filename: string };

const res = (folder: string, filename: string): ResourceImage => ({
  src: `/assets/resources/${folder}/${filename}`,
  filename,
});

export const tinyButtons = [res("tiny", "yourname-0.png")];

export const buttons88x31 = [
  res("buttons", "yourname-3.gif"),
  res("buttons", "yourname-2.gif"),
  res("buttons", "yourname-4.jpg"),
  res("buttons", "yourname-1.gif"),
  res("buttons", "yourname-5.jpg"),
  res("buttons", "yourname-6.jpg"),
];

export const squareButtons = [res("square", "yourname-0.gif"), res("square", "yourname-2.gif"), res("square", "yourname-1.gif")];

/** The three buttons shown on the home page widget. */
export const homeButtons = ["yourname-2.gif", "yourname-4.jpg", "yourname-5.jpg"]
  .map((f) => buttons88x31.find((b) => b.filename === f))
  .filter((b): b is ResourceImage => b !== undefined);
