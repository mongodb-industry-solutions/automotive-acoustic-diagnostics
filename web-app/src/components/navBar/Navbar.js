"use client";

import Link from "next/link";
import Image from "next/image";
import UserProfile from "@/components/userProfile/UserProfile";
import styles from "./navbar.module.css";
import { MongoDBLogoMark } from "@leafygreen-ui/logo";
import { useState } from "react";
import InfoWizard from "../infoWizard/InfoWizard";

const Navbar = () => {
  const [openHelpModal, setOpenHelpModal] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <MongoDBLogoMark color="black" />
        </Link>
      </div>

      <div className={styles.links}>
        <Link href="/">Demo Overview</Link>
        <Link href="/acoustic-diagnostics">Acoustic Diagnostics</Link>
      </div>

   
        <InfoWizard
          open={openHelpModal}
          setOpen={setOpenHelpModal}
          tooltipText="Tell me more!"
          iconGlyph="Wizard"
          sections={[
            {
              heading: "Instructions and Talk Track",
              content: [
                {
                  heading: "Demo Purpose",
                  body: "The demo illustrates how MongoDB's Atlas Vector Search and AWS Bedrock can be leveraged for advanced automotive diagnostics. It demonstrates the integration of diverse data types, such as telemetry and audio, enabling real-time analysis and proactive maintenance.  ",
                },
                {
                  heading: "How to Demo",
                  body: [
                    {
                      heading: 'Equipment',
                      body: [
                        'To make the demo more engaging at events, it can run with an actual physical device that simulates the real vehicle. The demo has been created for a specific engine replica controller through a Raspberry Pi',
                        'Otherwise, use the "simulate" tab in the UI.'
                      ]
                    },
                    {
                      heading: 'Running the demo with the simulator',
                      body: [
                        'Select a vehicle from the dropdown.',
                        'Select the “Simulation” mode. Using the simulation mode you will simulate telemetry data being streamed to MongoDB and from there to the Digital twin through Change Streams. You can also simulate sound packages of different states: “Running Normally” (default), “Soft Material Hit” and “Metallic Hit”.',
                        'Start the simulation and observe how the telemetry data is updated in the left hand side. The engine figure should be moving up and down, and the temperature and battery charge should change. ',
                        'Simulate an engine issue by clicking in “Soft Material Hit” or “Metallic Hit”. Leave it running for some time. The change of state will trigger an event to generate a Bedrock report providing the telemetry data. After approximately 30 seconds the report should be displayed in the analytics card next to the analytics dashboard.',
                      ]
                    },
                    {
                      heading: ' Running the demo with the physical engine',
                      body: [
                        'Select the “Live” mode',
                        'On start, the engine replica will generate telemetry data that will be streamed to MongoDB,and from there the web app will fetch this data through Change Streams to feed the digital twin and keep them both in sync. If the engine is stopped, all LED lights should be off. You will need to select the vehicle assigned to the engine replica, the engine replica vehicle will be assigned during the engine controller set up as described in the README file.',
                        'You can turn the engine on by tapping your finger on the obstacle sensor connected to the raspberry pi. Optionally you can turn it on from the iOS application. When the engine starts running, you should see that both the replica and the digital twin are in sync both on or off',
                        'Now it’s time to train our acoustic diagnostics module. Select a microphone of your choice, ideally an external microphone that is placed next to the engine replica in a stable position. Select the number of training samples, that is how many embeddings we will generate for each of the engine statuses we want to identify',
                        'Press “Start Recording”, all samples will be recorded automatically one after another',
                        'Press “Start diagnosis”. This will take the audio from the selected microphone plugged to your laptop, it will create embedding for each 1-second sample and use that embedding to query the training embeddings and identify the current status',
                        'If an issue is detected, you will see an alert in the left hand side of the vehicle information card and a bedrock report will be generated after some seconds related to that issue detection.'
                      ]
                    },

                  ],
                },
              ],
            },
            {
              heading: "Behind the Scenes",
              content: [
                {
                  heading: "Demo Overview",
                  body: "",
                },
                {
                  image: {
                    src: "./demooverview.png",
                    alt: "Architecture",
                  },
                },
              ],
            },
            {
              heading: "Why MongoDB?",
              content: [
                {
                  heading: "Unified Data Platform for Real-Time Diagnostics",
                  body: "MongoDB seamlessly integrates diverse data types, including telemetry, sensor data, etc. into a single database. This unified approach enables real-time analysis, allowing automotive manufacturers to detect anomalies early and take proactive maintenance actions, reducing downtime and improving vehicle reliability.",
                },
                {
                  heading: "Scalability for Complex Data Processingg",
                  body: "The flexible document model of MongoDB allows manufacturers to handle vast amounts of structured and unstructured data efficiently. This scalability is essential for advanced diagnostic tools, such as AI-driven sound analysis, which can quickly compare engine noises to a database of known issues, expediting problem identification and resolution.",
                },
                {
                  heading: "Seamless AI Integration for Advanced Diagnostics",
                  body: "Easy to integrate with AI tools for predictive maintenance and anomaly detection. Whether leveraging machine learning models to analyze sensor data or using AI-powered audio diagnostics for engine health assessment, MongoDB's compatibility with modern AI frameworks ensures smooth data processing and real-time insights, helping manufacturers enhance operational efficiency.",
                },

              ],
            },
          ]}
        />

        <UserProfile></UserProfile>

    </nav>
  );
};

export default Navbar;
