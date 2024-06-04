/**
 * Returns a promise that resolves in the next frame.
 */
export default function interactionResponse(): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(resolve, 100); // Fallback for the case where the animation frame never fires.
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
  });
}
