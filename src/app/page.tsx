'use client';
import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import LabPage from './lab/page';

export default function Home() {
 const [showLab, setShowLab] = useState(false);

 if (showLab) {
 return <LabPage />;
 }

 return <LandingPage onEnterLab={() => setShowLab(true)} />;
}
