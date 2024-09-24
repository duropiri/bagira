"use client";
import React, { useEffect, useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";

interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  lineStyles?: lineStyles;
  start?: number; // Percentage of the viewport where the animation should start
  end?: number; // Percentage of the viewport where the animation should end
}

interface lineStyles {
  marginTop?: string | number;
  marginRight?: string | number;
  height?: string | number;
  width?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
}

export default function CharByCharOnScroll({
  children,
  className,
  shadow,
  lineStyles,
  start = 90,
  end = 25,
}: AnimationProps) {
  const element = useRef<HTMLParagraphElement>(null);
  // Convert start and end to a percentage string format required by Framer Motion
  const offsetStart: any = `start ${start}%`;
  const offsetEnd: any = `start ${end}%`;
  const { scrollYProgress } = useScroll({
    target: element,
    // offset: ["start end", "start start"], // start animation once in view, complete animation at top of view
    offset: [offsetStart, offsetEnd],
  });

  // useEffect(() => {
  //   scrollYProgress.on("change", (e) => console.log(e));
  // }, []);

  const words = typeof children === "string" ? children.split(" ") : [];
  return (
    <p className={className + " flex flex-wrap leading-4"} ref={element}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        // console.log([start, end]);
        return (
          <Word
            key={"word:" + i}
            range={[start, end]}
            progress={scrollYProgress}
            shadow={shadow}
            lineStyles={lineStyles}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}

const Word = ({ children, range, progress, shadow, lineStyles }: any) => {
  const characters = children.split("");
  const amount = range[1] - range[0];
  const step = amount / children.length;

  return (
    <span
      className={!lineStyles ? styles.word : "relative"}
      style={{
        marginTop: lineStyles?.marginTop,
        marginBottom: lineStyles?.marginBottom,
        marginRight: lineStyles?.marginRight,
        marginLeft: lineStyles?.marginLeft,
        height: lineStyles?.height,
        width: lineStyles?.width,
      }}
    >
      {characters.map((character: any, i: any) => {
        const start = range[0] + step * i;
        const end = range[0] + step * (i + 1);
        return (
          <Character
            key={"character" + i}
            range={[start, end]}
            progress={progress}
            shadow={shadow}
          >
            {character}
          </Character>
        );
      })}
    </span>
  );
};

const Character = ({ children, range, progress, shadow }: any) => {
  const opacity = useTransform(progress, range, [0, 1]);

  if (shadow) {
    return (
      <span>
        <span className={styles.shadow}>{children}</span>
        <motion.span style={{ opacity }}>{children}</motion.span>
      </span>
    );
  } else {
    return <motion.span style={{ opacity }}>{children}</motion.span>;
  }
};

const styles = {
  word: "mr-[1ch] mt-[1ch] relative", // Adjust mr and mt if character spacing is ugly
  shadow: "absolute opacity-10",
};
