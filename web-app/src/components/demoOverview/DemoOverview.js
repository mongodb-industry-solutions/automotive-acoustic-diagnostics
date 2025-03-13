"use client";

import styles from "./demoOverview.module.css";

import { H1, H3, Body, Description, Link } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";
import Image from "next/image";

const OverviewComp = () => {
  return (
    <div className={styles.body}>
      <H1 className={styles.pageTitle}>
        Welcome to the automotive acoustic diagnostics demo!
      </H1>

      <Image
        src="/demooverview.png"
        className={styles.architectureImage}
        alt="Flow"
        height={1000}
        width={1000}
      ></Image>

      <H3 className={styles.compTitle}>Check out our related resources!</H3>

      <div className={styles.container}>
        <Card className={styles.card}>
          <a
            className={styles.title}
            href="https://www.mongodb.com/solutions/solutions-library/automotive-diagnostics"
          >
            <Image
              src="/logos/read.png"
              className={styles.image}
              alt="Retail"
              height={20}
              width={20}
            ></Image>
            <H3 className={styles.title}>Solutions Library</H3>
          </a>
          <Description className={styles.description}>
            {" "}
            Learn more about using vector search and generative AI for
            root-cause diagnostics
          </Description>

          <Link
            href="https://www.mongodb.com/solutions/solutions-library/automotive-diagnostics"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            Read the article
          </Link>
        </Card>

        <Card className={styles.card}>
          <a
            className={styles.title}
            href="https://github.com/mongodb-industry-solutions/automotive-acoustic-diagnostics"
          >
            <Image
              src="/logos/github.png"
              className={styles.image}
              alt="GitHub Logo"
              height={20}
              width={20}
            ></Image>
            <H3 className={styles.title}>Github Repo</H3>
          </a>
          <Description className={styles.description}>
            {" "}
            Follow the step-by-step guide and play around with the demo
            yourself.
          </Description>
          <Link
            href="https://github.com/mongodb-industry-solutions/automotive-acoustic-diagnostics"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            Try the demo
          </Link>
        </Card>

        <Card className={styles.card}>
          <a
            className={styles.title}
            href="https://www.youtube.com/watch?v=aQNFAjJVDpY"
          >
            <Image
              src="/logos/youtube.png"
              className={styles.image}
              alt="Youtube Logo"
              height={20}
              width={20}
            ></Image>
            <H3 className={styles.title}>YouTube Video</H3>
          </a>
          <Description className={styles.description}>
            {" "}
            Explore how MongoDB and Atlas Vector Search can be leveraged to
            create a comprehensive root-cause diagnostics strategy for the
            manufacturing and automotive industries.
          </Description>
          <Link
            href="https://www.youtube.com/watch?v=aQNFAjJVDpY"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            Watch the video
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default OverviewComp;
