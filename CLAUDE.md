# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A simple weather tracking web application that allows users to log daily weather experiences as "good", "bad", or "okay" and visualize them in a calendar-style grid. This is a public application with no authentication.

## Application Routes

- **Root route (/)**: Calendar visualization with color-coded squares (green=good, yellow=okay, red=bad, gray=no data/future)
- **Set weather route (/set_weather)**: Form with date picker (defaults to today) and dropdown for weather rating

## Tech Stack Requirements

- **Frontend**: React with prebuilt UI components, professional datepicker library
- **Backend**: Minimal requirements initially, may expand for future authentication/API integrations
- **Database**: Simple solution for storing weather entries
- **Deployment**: Free/low-cost solution supporting frontend, backend, and database for personal use

## Development Status

New project in planning phase. Implementation has not yet begun - only project specification exists.

## Key Design Principles

- Calendar grid is the primary interface and should look polished
- Form interface can be simple but functional
- Use prebuilt components rather than custom implementations
- Focus on low-cost deployment solutions