---
title: "Signal Processing Field Notes"
date: 2026-04-09
category: "research"
tags:
  - research
  - networking
---

Collected observations from recent signal analysis work.

## Background

During routine network topology mapping, several anomalous signal patterns were identified in the 2.4GHz spectrum. These notes document initial findings and methodology.

## Methodology

Standard spectrum analysis was performed using `rtl-sdr` hardware with `GNU Radio` for signal processing. Data was collected over a 48-hour window with 15-minute sampling intervals.

```
Frequency range: 2400-2500 MHz
Sample rate:     2.4 MSPS
Gain:            42 dB
Duration:        48h continuous
```

## Observations

1. **Baseline noise floor** — Consistent at -95 dBm across the band
2. **Known signals** — WiFi channels 1, 6, 11 identified as expected
3. **Anomalous pattern** — Narrowband signal at 2.437 GHz with unusual 200ms burst pattern

## Next Steps

- Extended monitoring window (7-day capture)
- Direction finding with multi-antenna setup
- Cross-reference with FCC license database

Further analysis pending additional hardware deployment.
