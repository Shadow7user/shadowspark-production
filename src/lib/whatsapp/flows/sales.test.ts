import { flow } from "./sales"

describe("sales flow", () => {
  it("exports correct shape", () => {
    expect(flow.persona).toBeTruthy()
    expect(flow.welcomeMessage).toBeTruthy()
    expect(flow.assignedTo).toBe("reginald")
    expect(typeof flow.handleMessage).toBe("function")
  })
})
