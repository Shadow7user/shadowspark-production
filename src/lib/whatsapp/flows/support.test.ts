import { flow } from "./support"

describe("support flow", () => {
  it("exports correct shape", () => {
    expect(flow.persona).toBeTruthy()
    expect(flow.welcomeMessage).toBeTruthy()
    expect(flow.assignedTo).toBe("emmanuel")
    expect(typeof flow.handleMessage).toBe("function")
  })
})
