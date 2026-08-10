import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { footerCompanies, footerAboutLinks } from "@/data/companies";

describe("Footer", () => {
  it("renders the copyright notice", () => {
    render(<Footer />);
    expect(screen.getByText(/All Rights Reserved/i)).toBeInTheDocument();
  });

  it("renders a link for every company in footerCompanies", () => {
    render(<Footer />);
    for (const company of footerCompanies) {
      expect(
        screen.getByRole("link", { name: company.name })
      ).toHaveAttribute("href", company.href);
    }
  });

  it("renders a link for every about link", () => {
    render(<Footer />);
    for (const link of footerAboutLinks) {
      expect(screen.getByRole("link", { name: link.name })).toHaveAttribute(
        "href",
        link.href
      );
    }
  });

  it("renders the 'View all companies' call to action", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /view all companies/i })
    ).toHaveAttribute("href", "/portfolio/");
  });
});
