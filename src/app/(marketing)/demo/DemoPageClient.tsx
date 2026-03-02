'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Recording {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  url: string;
  transcript: { speaker: string; text: string }[];
}

const RECORDINGS: Recording[] = [
  {
    id: 'booking',
    title: 'Customer books a window cleaning',
    subtitle: '2-story colonial — full booking with pricing',
    duration: '2:00',
    url: '/audio/demo-call-wc-booking-mike.m4a',
    transcript: [
      { speaker: 'Sarah', text: "Hey there! Thanks for calling Clean Pro Window Washing, this is Sarah. How can I help you today?" },
      { speaker: 'Caller', text: "I'm interested in getting my two story colonial home washed, just the exterior windows only." },
      { speaker: 'Sarah', text: "For a two-story exterior, every job is a little different, but typically you're looking at somewhere between $250 to $400." },
      { speaker: 'Caller', text: "That sounds great. It's 34 Elm Street in Poughkeepsie, 12601." },
      { speaker: 'Sarah', text: "We have openings at 8 AM, 9 AM, and 10 AM. Would any of those work for you?" },
      { speaker: 'Caller', text: "Let's book it in for Friday at 10 AM." },
      { speaker: 'Sarah', text: "You're all set for Friday, March 6th at 10 AM! You'll get a confirmation text shortly." },
    ],
  },
  {
    id: 'emergency',
    title: 'Emergency call — active kitchen leak',
    subtitle: 'Water leaking from kitchen sink — immediate escalation',
    duration: '2:45',
    url: '/audio/demo-call-plumbing-emergency-david.m4a',
    transcript: [
      { speaker: 'Sarah', text: 'Thank you for calling Hudson Valley Plumbing! This is Sarah. How can I help you today?' },
      { speaker: 'Caller', text: 'I have water leaking coming from my kitchen sink. I need somebody out today.' },
      { speaker: 'Sarah', text: 'Just to confirm — do you have water actively leaking or flooding right now?' },
      { speaker: 'Caller', text: "I do. It's actively leaking." },
      { speaker: 'Sarah', text: "Okay David, I'm going to get someone out to you right away." },
      { speaker: 'Sarah', text: "I've sent an emergency alert to our team right now. Someone will call you back as soon as possible." },
      { speaker: 'Caller', text: "Alright. I appreciate it. I'll wait for their call." },
      { speaker: 'Sarah', text: "You're welcome, David. Have a great day!" },
    ],
  },
];
