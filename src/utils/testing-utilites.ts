export function createFetchResponse(data: any) {
  return { json: () => new Promise((resolve) => resolve(data)) };
}
