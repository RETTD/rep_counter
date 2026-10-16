import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PatientSelector } from "./patient-selector.js";

describe("PatientSelector", () => {
  it("disables its trigger while a session is saving", () => {
    const markup = renderToStaticMarkup(
      <PatientSelector disabled onValueChange={() => {}} value="alice" />,
    );

    expect(markup).toContain('disabled=""');
  });
});
