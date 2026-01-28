"use client";

import React from "react";
import type { ContentBlockType } from "../../domain/contentBlockType";

type SourceContentBlockType = Extract<ContentBlockType, { type: "source" }>;

type Props = {
    block: SourceContentBlockType;
    index: number;
};

export const SourceBlock = ({ block }: Props) => {
    const source = typeof block.source === "string" ? block.source : "";

    if (!source) return null;
    console.log(source);

    return (
        // <main className="dataset-style">
        //     <section className="dataset-style-hero">
        //         <div
        //             className="dataset-style-heroBg"
        //             style={{
        //                 backgroundImage:
        //                     "url('https://storage.googleapis.com/plus_platform/8a1fd689-546d-41d0-bd63-65e3f5f6389b_mission_driven_culture_breakdown.jpg');",
        //             }}
        //         ></div>
        //         <div className="dataset-style-heroShade"></div>

        //         <div className="dataset-style-heroOverlay">
        //             <div className="dataset-style-heroBig font-display">
        //                 Mission-<br />
        //                 Driven<br />
        //                 Culture<br />
        //                 Breakdown
        //             </div>
        //         </div>

        //         <div className="dataset-style-heroContent">
        //             <p className="dataset-style-heroKicker font-display">
        //                 Mission-Driven Company Culture
        //             </p>
        //         </div>
        //     </section>

        //     <section className="dataset-style-dark">
        //         <div className="dataset-style-wrap dataset-style-pad-dark content-pad">
        //             <div className="dataset-style-center">
        //                 <h2 className="dataset-style-title-sm font-display">
        //                     Key Characteristics
        //                 </h2>
        //             </div>

        //             <div className="dataset-style-grid5">
        //                 <div className="dataset-style-center dataset-style-iconCard">
        //                     <div className="dataset-style-iconWrap">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-icon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <path d="M12 2L2 7l10 5 10-5-10-5z" />
        //                             <path d="M2 17l10 5 10-5" />
        //                             <path d="M2 12l10 5 10-5" />
        //                         </svg>
        //                     </div>
        //                     <p className="dataset-style-cardTitle font-display">
        //                         Purpose-Driven
        //                     </p>
        //                     <p className="dataset-style-cardText">
        //                         Employees are united by a shared sense of purpose and dedication to
        //                         the company's mission.
        //                     </p>
        //                 </div>

        //                 <div className="dataset-style-center dataset-style-iconCard">
        //                     <div className="dataset-style-iconWrap">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-icon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        //                         </svg>
        //                     </div>
        //                     <p className="dataset-style-cardTitle font-display">
        //                         Values-Oriented
        //                     </p>
        //                     <p className="dataset-style-cardText">
        //                         The company's core values guide decision making and behavior.
        //                     </p>
        //                 </div>

        //                 <div className="dataset-style-center dataset-style-iconCard">
        //                     <div className="dataset-style-iconWrap">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-icon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        //                             <polyline points="9 22 9 12 15 12 15 22" />
        //                         </svg>
        //                     </div>
        //                     <p className="dataset-style-cardTitle font-display">
        //                         Community Impact
        //                     </p>
        //                     <p className="dataset-style-cardText">
        //                         Focuses on making a positive impact on society or the environment.
        //                     </p>
        //                 </div>

        //                 <div className="dataset-style-center dataset-style-iconCard">
        //                     <div className="dataset-style-iconWrap">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-icon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        //                             <circle cx="9" cy="7" r="4" />
        //                             <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        //                             <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        //                         </svg>
        //                     </div>
        //                     <p className="dataset-style-cardTitle font-display">
        //                         Employee Engagement
        //                     </p>
        //                     <p className="dataset-style-cardText">
        //                         High levels of engagement and motivation driven by strong alignment
        //                         with the mission.
        //                     </p>
        //                 </div>

        //                 <div className="dataset-style-center dataset-style-iconCard">
        //                     <div className="dataset-style-iconWrap">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-icon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        //                         </svg>
        //                     </div>
        //                     <p className="dataset-style-cardTitle font-display">
        //                         Ethical Standards
        //                     </p>
        //                     <p className="dataset-style-cardText">
        //                         High ethical standards and integrity are paramount.
        //                     </p>
        //                 </div>
        //             </div>
        //         </div>

        //         <div className="diag" />
        //         {/* <div className="dataset-style-diag dataset-style-diagWhite"></div> */}
        //     </section>

        //     <section className="dataset-style-light">
        //         <div className="dataset-style-wrap dataset-style-pad-light content-pad">
        //             <h2 className="dataset-style-softTitle font-display">Key Soft Skills</h2>

        //             <div className="dataset-style-softGrid">
        //                 <div className="dataset-style-softCol">
                            
        //                     <div className="dataset-style-softRow">
        //                         <div className="dataset-style-num">1</div>
        //                         <div>
        //                             <div className="dataset-style-softLabel font-display">
        //                                 Passion
        //                             </div>
        //                             <div className="dataset-style-softDesc">
        //                                 Strong passion for the company's mission and values.
        //                             </div>
        //                         </div>
        //                     </div>

        //                     <div className="dataset-style-softRow">
        //                         <div className="dataset-style-num">3</div>
        //                         <div>
        //                             <div className="dataset-style-softLabel font-display">
        //                                 Commitment
        //                             </div>
        //                             <div className="dataset-style-softDesc">
        //                                 Dedication to achieving the organization's goals and making a
        //                                 positive impact.
        //                             </div>
        //                         </div>
        //                     </div>

        //                     <div className="dataset-style-softRow">
        //                         <div className="dataset-style-num">5</div>
        //                         <div>
        //                             <div className="dataset-style-softLabel font-display">
        //                                 Integrity
        //                             </div>
        //                             <div className="dataset-style-softDesc">
        //                                 Adherence to high ethical standards and a commitment to doing
        //                                 the right thing.
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>

        //                 <div className="dataset-style-softCol">
        //                     <div className="dataset-style-softRow">
        //                         <div className="dataset-style-num">2</div>
        //                         <div>
        //                             <div className="dataset-style-softLabel font-display">
        //                                 Teamwork
        //                             </div>
        //                             <div className="dataset-style-softDesc">
        //                                 Ability to work collaboratively with others towards a common
        //                                 goal.
        //                             </div>
        //                         </div>
        //                     </div>

        //                     <div className="dataset-style-softRow">
        //                         <div className="dataset-style-num">4</div>
        //                         <div>
        //                             <div className="dataset-style-softLabel font-display">
        //                                 Communication
        //                             </div>
        //                             <div className="dataset-style-softDesc">
        //                                 Effective communication to articulate the mission and values
        //                                 clearly.
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>

        //         {/* <div className="dataset-style-diag dataset-style-diagBlack"></div> */}
        //     </section>

        //     <section className="dataset-style-dark">
        //         <div className="dataset-style-wrap dataset-style-pad-dark content-pad">
        //             <div className="dataset-style-center">
        //                 <h2 className="dataset-style-title-sm font-display">Industry Examples</h2>
        //             </div>

        //             <div className="dataset-style-grid4">
        //                 <div className="dataset-style-center dataset-style-iconCard">
        //                     <div className="dataset-style-iconWrap">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-icon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        //                             <polyline points="9 22 9 12 15 12 15 22" />
        //                         </svg>
        //                     </div>
        //                     <p className="dataset-style-cardTitle font-display">Non-Profits</p>
        //                     <p className="dataset-style-cardText">
        //                         Organizations like UNICEF and the Red Cross that focus on
        //                         humanitarian efforts.
        //                     </p>
        //                 </div>

        //                 <div className="dataset-style-center dataset-style-iconCard">
        //                     <div className="dataset-style-iconWrap">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-icon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <circle cx="12" cy="12" r="10" />
        //                             <path d="M12 6v6l4 2" />
        //                         </svg>
        //                     </div>
        //                     <p className="dataset-style-cardTitle font-display">
        //                         Environmental Groups
        //                     </p>
        //                     <p className="dataset-style-cardText">
        //                         Companies like Patagonia and Tesla that prioritize sustainability
        //                         and environmental responsibility.
        //                     </p>
        //                 </div>

        //                 <div className="dataset-style-center dataset-style-iconCard">
        //                     <div className="dataset-style-iconWrap">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-icon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        //                             <line x1="9" y1="9" x2="15" y2="9" />
        //                             <line x1="9" y1="15" x2="15" y2="15" />
        //                         </svg>
        //                     </div>
        //                     <p className="dataset-style-cardTitle font-display">
        //                         Social Enterprises
        //                     </p>
        //                     <p className="dataset-style-cardText">
        //                         Businesses like TOMS Shoes that integrate social missions into their
        //                         business models.
        //                     </p>
        //                 </div>

        //                 <div className="dataset-style-center dataset-style-iconCard">
        //                     <div className="dataset-style-iconWrap">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-icon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        //                         </svg>
        //                     </div>
        //                     <p className="dataset-style-cardTitle font-display">Healthcare</p>
        //                     <p className="dataset-style-cardText">
        //                         Organizations like Doctors Without Borders that are committed to
        //                         providing medical aid in underserved areas.
        //                     </p>
        //                 </div>
        //             </div>
        //         </div>

        //         <div className="diag" />
        //         {/* <div className="dataset-style-diag dataset-style-diagWhite"></div> */}
        //     </section>

        //     <section className="dataset-style-light">
        //         <div className="dataset-style-wrap dataset-style-pad-light content-pad">
        //             <div className="dataset-style-grid2">
        //                 <div className="dataset-style-bcCard">
        //                     <div className="dataset-style-bcHead">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-bcIcon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <polyline points="18 15 12 9 6 15" />
        //                         </svg>
        //                         <div className="dataset-style-bcTitle font-display">
        //                             Benefits of Mission-Driven Culture
        //                         </div>
        //                     </div>

        //                     <div className="dataset-style-bcText">
        //                         <div>
        //                             <span className="dataset-style-strong">High Motivation:</span>{" "}
        //                             Employees are highly motivated and driven by a sense of purpose.
        //                         </div>
        //                         <div>
        //                             <span className="dataset-style-strong">Strong Cohesion:</span> A
        //                             shared mission fosters strong team cohesion and a sense of
        //                             community.
        //                         </div>
        //                         <div>
        //                             <span className="dataset-style-strong">Positive Impact:</span>{" "}
        //                             The organization can make a significant positive impact on
        //                             society or the environment.
        //                         </div>
        //                         <div>
        //                             <span className="dataset-style-strong">Employee Retention:</span>{" "}
        //                             High levels of job satisfaction and loyalty lead to better
        //                             employee retention.
        //                         </div>
        //                         <div>
        //                             <span className="dataset-style-strong">Attracting Talent:</span>{" "}
        //                             Attracts like-minded individuals who are passionate about the
        //                             mission.
        //                         </div>
        //                     </div>
        //                 </div>

        //                 <div className="dataset-style-bcCard">
        //                     <div className="dataset-style-bcHead">
        //                         <svg
        //                             viewBox="0 0 24 24"
        //                             className="dataset-style-bcIcon"
        //                             fill="none"
        //                             stroke="currentColor"
        //                             stroke-linecap="round"
        //                             stroke-linejoin="round"
        //                         >
        //                             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        //                             <line x1="12" y1="9" x2="12" y2="13" />
        //                             <line x1="12" y1="17" x2="12.01" y2="17" />
        //                         </svg>
        //                         <div className="dataset-style-bcTitle font-display">
        //                             Challenges of Mission-Driven Culture
        //                         </div>
        //                     </div>

        //                     <div className="dataset-style-bcText">
        //                         <div>
        //                             <span className="dataset-style-strong">Resource Constraints:</span>{" "}
        //                             Limited resources can make it challenging to achieve ambitious
        //                             goals.
        //                         </div>
        //                         <div>
        //                             <span className="dataset-style-strong">Potential for Burnout:</span>{" "}
        //                             High levels of commitment and passion can sometimes lead to
        //                             burnout.
        //                         </div>
        //                         <div>
        //                             <span className="dataset-style-strong">Balancing Profit and Purpose:</span>{" "}
        //                             Finding the right balance between financial sustainability and
        //                             mission goals can be difficult.
        //                         </div>
        //                         <div>
        //                             <span className="dataset-style-strong">Managing Expectations:</span>{" "}
        //                             Aligning expectations of stakeholders with the mission can be
        //                             challenging.
        //                         </div>
        //                         <div>
        //                             <span className="dataset-style-strong">Maintaining Focus:</span>{" "}
        //                             Ensuring that the focus remains on the mission amid operational
        //                             challenges.
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>

        //         {/* <div className="dataset-style-diag dataset-style-diagBlack content-pad"></div> */}
        //     </section>

        //     <section className="dataset-style-dark">
        //         <div className="dataset-style-wrap dataset-style-pad-dark content-pad">
        //             <div className="dataset-style-darkInner">
        //                 <div className="dataset-style-darkHead">
        //                     <svg
        //                         viewBox="0 0 24 24"
        //                         className="dataset-style-darkIcon"
        //                         fill="none"
        //                         stroke="currentColor"
        //                         stroke-linecap="round"
        //                         stroke-linejoin="round"
        //                     >
        //                         <path d="M12 2v20" />
        //                         <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        //                     </svg>
        //                     <div className="dataset-style-darkTitle font-display">
        //                         How to Thrive in a Mission-Driven Culture
        //                     </div>
        //                 </div>

        //                 <div className="dataset-style-darkList">
        //                     <div>
        //                         <span className="dataset-style-darkStrong">Align with the Mission:</span>{" "}
        //                         Ensure that your personal values and goals align with the
        //                         organization's mission.
        //                     </div>
        //                     <div>
        //                         <span className="dataset-style-darkStrong">Stay Committed:</span>{" "}
        //                         Demonstrate dedication and a strong commitment to the cause.
        //                     </div>
        //                     <div>
        //                         <span className="dataset-style-darkStrong">Collaborate Effectively:</span>{" "}
        //                         Work well with others to achieve the common mission.
        //                     </div>
        //                     <div>
        //                         <span className="dataset-style-darkStrong">Communicate Passionately:</span>{" "}
        //                         Articulate your passion for the mission clearly and effectively.
        //                     </div>
        //                     <div>
        //                         <span className="dataset-style-darkStrong">Balance Passion and Practicality:</span>{" "}
        //                         Maintain a balance between your passion for the mission and
        //                         practical considerations.
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>

        //         <div className="diag" />
        //         {/* <div className="dataset-style-diag dataset-style-diagWhite"></div> */}
        //     </section>

        //     <section className="dataset-style-light">
        //         <div className="dataset-style-wrap dataset-style-pad-light content-pad">
        //             <div className="dataset-style-researchInner">
        //                 <div className="dataset-style-researchHead">
        //                     <svg
        //                         viewBox="0 0 24 24"
        //                         className="dataset-style-researchIcon"
        //                         fill="none"
        //                         stroke="currentColor"
        //                         stroke-linecap="round"
        //                         stroke-linejoin="round"
        //                     >
        //                         <circle cx="11" cy="11" r="8" />
        //                         <line x1="21" y1="21" x2="16.65" y2="16.65" />
        //                         <line x1="11" y1="8" x2="11" y2="14" />
        //                         <line x1="8" y1="11" x2="14" y2="11" />
        //                     </svg>
        //                     <div className="dataset-style-researchTitle font-display">Research Tips</div>
        //                 </div>

        //                 <div className="dataset-style-researchText">
        //                     <div>
        //                         <span className="dataset-style-strong">Company Website and Reports:</span>{" "}
        //                         Look for information on the company's mission, values, and impact
        //                         reports.
        //                     </div>
        //                     <div>
        //                         <span className="dataset-style-strong">Social Media and News:</span>{" "}
        //                         Follow the company on social media and look for news articles to
        //                         understand their mission-driven initiatives.
        //                     </div>
        //                     <div>
        //                         <span className="dataset-style-strong">Employee Reviews:</span>{" "}
        //                         Platforms like Glassdoor can provide insights into how the mission
        //                         and values are integrated into daily work life.
        //                     </div>
        //                     <div>
        //                         <span className="dataset-style-strong">Networking:</span> Connect
        //                         with current or former employees to learn about their experiences
        //                         and the impact of the mission-driven culture.
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </section>
        // </main>
        <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: source }}
        />
    );
};