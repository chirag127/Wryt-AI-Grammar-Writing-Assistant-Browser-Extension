# Security Policy

At Wryt-AI-Grammar-Writing-Assistant-Browser-Extension, we take the security of our users and their data with the utmost seriousness. This document outlines our policy for handling security vulnerabilities and provides guidelines for reporting them responsibly.

## 🛡️ Reporting a Vulnerability

We genuinely appreciate the efforts of security researchers and the community in helping us maintain a secure product. If you discover a security vulnerability, please report it to us as soon as possible through our private disclosure channel.

**Please DO NOT open a public GitHub issue.** Public disclosure can put the entire user base at risk before a fix is available.

To report a vulnerability, please send an email to:

**`security@wryt-ai.com`**

When reporting, please include the following information:

*   **Description:** A clear and concise description of the vulnerability.
*   **Steps to Reproduce:** Detailed steps to reliably reproduce the vulnerability.
*   **Impact:** Explain the potential impact of the vulnerability.
*   **Affected Versions:** Specify which versions of the extension are affected.
*   **Proof of Concept (Optional but highly recommended):** Any code, screenshots, or videos that demonstrate the vulnerability.
*   **Your Contact Information:** (Optional) If you wish to be credited, please provide your name/handle.

## 🔒 Our Responsible Disclosure Policy

We commit to:

1.  **Prompt Acknowledgment:** We will acknowledge receipt of your report within **48 business hours**.
2.  **Investigation & Remediation:** We will investigate your report thoroughly and work diligently to develop a fix.
3.  **Communication:** We will keep you informed of our progress and provide an estimated timeline for remediation.
4.  **Public Disclosure (Post-Fix):** Once a fix is deployed, we will coordinate with you (if desired) on a public disclosure, acknowledging your contribution in our security advisories.
5.  **No Retaliation:** We will not pursue legal action against individuals who report vulnerabilities in good faith and adhere to this policy.

## 🚨 Severity Levels & Triage

Vulnerabilities are triaged based on their potential impact and exploitability, typically following the CVSS (Common Vulnerability Scoring System) standard.

*   **Critical:** Remote Code Execution (RCE), Authentication Bypass, Major Data Breach.
*   **High:** Cross-Site Scripting (XSS), SQL Injection, Significant Information Disclosure.
*   **Medium:** Cross-Site Request Forgery (CSRF), Denial of Service (DoS), Minor Information Disclosure.
*   **Low:** Configuration errors, Self-XSS (without user interaction).

We prioritize critical and high-severity issues, aiming to release patches as quickly as possible.

## 🚧 Best Practices for Contributors

All contributors are expected to adhere to secure coding practices:

*   **Input Validation:** Sanitize and validate all user inputs to prevent injection attacks.
*   **Output Encoding:** Encode all outputs to prevent XSS.
*   **Least Privilege:** Ensure components operate with the minimum necessary permissions.
*   **Dependency Management:** Regularly update dependencies and audit for known vulnerabilities.
*   **Sensitive Data:** Never hardcode sensitive information (API keys, secrets).
*   **Authentication & Authorization:** Properly implement and enforce security controls for all features.
*   **Supply Chain Security:** Be vigilant about new npm package inclusions and their integrity.

## 📜 Security Advisories

For past security advisories and updates, please refer to our [GitHub Security Advisories](https://github.com/Wryt-AI/Wryt-AI-Grammar-Writing-Assistant-Browser-Extension/security/advisories) page.

Thank you for helping us keep Wryt-AI-Grammar-Writing-Assistant-Browser-Extension secure!