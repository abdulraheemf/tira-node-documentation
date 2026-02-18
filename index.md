---
layout: home

hero:
  name: "tira-node"
  text: "The unofficial Node.js SDK for TIRA's TIRAMIS"
  tagline: Just setup the package and go live. No stressing.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/Labedan-IT-Solutions/tira-node

features:
  - title: Full TIRAMIS Coverage
    details: Motor, fleet, non-life, reinsurance, policy, cover note verification, and the entire claims lifecycle — all 12 TIRA operations in one package.
  - title: Built-in Security
    details: XML digital signatures, PFX certificate handling, mutual TLS, and callback signature verification — handled automatically under the hood.
  - title: TypeScript-First
    details: Every payload, response, and config option is fully typed. Works with both ESM and CommonJS out of the box.
---

## Why we built this

We use `tira-node` internally at Labedan IT Solutions. When we started integrating with TIRA's TIRAMIS, we quickly realized how painful the process is — raw XML construction, PFX certificate signing, SOAP-style message wrapping, mutual TLS, and callback parsing. There was no Node.js library to help.

So we built one. And then we thought: why keep it to ourselves? Every insurance company and broker in Tanzania goes through the same struggle. We packaged our internal tooling into an open-source SDK and published it on npm so the community can benefit.

## Languages

This documentation is available in **English** and **Kiswahili**. You can switch between them using the language selector in the navigation bar.

We did our best to translate the documentation into Kiswahili, but some technical terms were intentionally left in English where we felt they would be better understood by the developer community (e.g., "callback", "endpoint", "payload").

If you spot a translation that could be improved or is incorrect, we'd love your help — just open a pull request on the [documentation repository](https://github.com/Labedan-IT-Solutions/tira-node-documentation) and we'll review and merge it.

## Roadmap

`tira-node` started as an internal tool and is now open-source on npm. We actively use it in production, so it will continue to receive updates and maintenance.

Depending on community adoption and feedback, we're planning to bring this to more languages:

- **Node.js** — available now
- **Python** — planned
- **Java** — planned
- **PHP** — planned

Have a language you'd like to see supported? [Open an issue](https://github.com/Labedan-IT-Solutions/tira-node/issues) and let us know.

## Need Help?

### Community Support

For bug reports, feature requests, and general questions — head to [GitHub Issues](https://github.com/Labedan-IT-Solutions/tira-node/issues). It's free, community-driven, and we respond as we can.

### Professional Integration Services

Need hands-on help integrating `tira-node` into your systems? Labedan IT Solutions offers professional setup and integration services to get you up and running fast.

Reach out to us at **[support@labedan.solutions](mailto:support@labedan.solutions)** and let's talk.

## About Labedan IT Solutions

Labedan IT Solutions is a Tanzania-based technology company focused on building practical tools and solutions for East African businesses. We specialize in making complex integrations simple — so companies can focus on what they do best instead of fighting with infrastructure.

[Visit us on GitHub](https://github.com/Labedan-IT-Solutions) · [labedan.solutions](https://labedan.solutions)

## Disclaimer

> **This project is NOT affiliated with, endorsed by, or officially connected to TIRA (Tanzania Insurance Regulatory Authority) in any way.**
>
> `tira-node` is an independent, community-driven open-source project created and maintained by Labedan IT Solutions. For official TIRA documentation, guidelines, and compliance requirements, always refer to TIRA directly.
