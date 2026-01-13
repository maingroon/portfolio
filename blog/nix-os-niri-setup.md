---
title: Nix OS + Niri Setup
date: 2026-01-09
tags: [nixos, linux, window-manager, niri, wayland]
excerpt: A comprehensive guide to setting up NixOS with Niri, a modern Wayland compositor for a tiling window manager experience.
---

# Nix OS + Niri Setup

NixOS is a unique Linux distribution built on the Nix package manager, offering declarative system configuration and reproducible builds. Combined with Niri, a modern Wayland compositor, you get a powerful and customizable desktop environment.

## What is NixOS?

NixOS is a Linux distribution that uses a purely functional package management approach. Your entire system configuration is defined in a single configuration file (`configuration.nix`), making it easy to reproduce, version control, and rollback changes.

## What is Niri?

Niri is a scrollable-tiling Wayland compositor that provides a modern, keyboard-driven window management experience. It's written in Rust and offers smooth animations and a clean, minimal interface.

## Installation Steps

### 1. Install NixOS

First, download the NixOS ISO and install it on your system. During installation, you'll configure your initial `configuration.nix` file.

### 2. Configure NixOS for Niri

Add the following to your `configuration.nix`:

```nix
{ config, pkgs, ... }:

{
  # Enable Wayland
  services.xserver.enable = false;
  
  # Enable Niri
  programs.niri.enable = true;
  
  # Required packages
  environment.systemPackages = with pkgs; [
    niri
    waybar
    rofi-wayland
    alacritty
  ];
  
  # Enable fonts
  fonts.packages = with pkgs; [
    (nerdfonts.override { fonts = [ "FiraCode" "DroidSansMono" ]; })
  ];
}
```

### 3. Configure Niri

Create a Niri configuration file at `~/.config/niri/config.kdl`:

```kdl
general {
  border-width 2
  border-radius 8
  gaps 8
}

animations {
  enabled true
  spring 100 0.85
}

input {
  keyboard {
    repeat-delay 200
    repeat-rate 30
  }
}

workspaces {
  outputs "eDP-1"
  layout "MainAndVertStack"
}
```

### 4. Key Bindings

Niri comes with sensible defaults, but you can customize key bindings in the config:

- `Super + Enter`: Open terminal
- `Super + D`: Open application launcher
- `Super + Q`: Close window
- `Super + H/V`: Focus left/down
- `Super + J/K`: Focus down/up
- `Super + Shift + H/V/J/K`: Move window

## Post-Installation

After rebooting, you should be able to log into your Niri session. Customize your setup further by:

1. Configuring Waybar for a status bar
2. Setting up Rofi for application launching
3. Customizing your terminal (Alacritty) colors and fonts
4. Adding additional NixOS packages as needed

## Benefits of This Setup

- **Reproducible**: Your entire system is defined in configuration files
- **Rollback**: Easy to revert to previous system states
- **Modern**: Wayland provides better security and performance
- **Efficient**: Tiling window manager maximizes screen space
- **Customizable**: Everything can be configured to your preferences

## Conclusion

NixOS with Niri provides a powerful, modern, and highly customizable Linux desktop experience. The declarative nature of NixOS combined with Niri's efficient window management creates an excellent development environment.
