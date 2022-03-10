import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import StandardDialog from '../StandardDialog';

function Header1({ children, ...rest }) {
  return (
    <Typography component="h1" variant="h4" gutterBottom {...rest}>
      {children}
    </Typography>
  );
}

function Header2({ children, ...rest }) {
  return (
    <Typography component="h2" variant="h5" gutterBottom {...rest}>
      {children}
    </Typography>
  );
}

function Header3({ children, ...rest }) {
  return (
    <Typography component="h3" variant="h6" gutterBottom {...rest}>
      {children}
    </Typography>
  );
}

function Header4({ children, ...rest }) {
  return (
    <Typography
      component="h4"
      variant="subtitle2"
      gutterBottom
      style={{ fontStyle: 'italic', fontWeight: 'bold' }}
      {...rest}
    >
      {children}
    </Typography>
  );
}

function Paragraph({ children, ...rest }) {
  return (
    <Typography paragraph {...rest}>
      {children}
    </Typography>
  );
}

function ListItem({ children, ...rest }) {
  return (
    <Typography component="li" {...rest}>
      {children}
    </Typography>
  );
}

function Definition({ children }) {
  return <dfn style={{ fontStyle: 'normal' }}>{children}</dfn>;
}

export default function TermsAndConditionsDialog({
  visible,
  onClose,
}) {
  return (
    <StandardDialog
      open={visible}
      onClose={onClose}
      titleId="TERMS_AND_CONDITIONS"
      maxWidth="md"
    >
      <DialogContent
        dividers
        style={{ marginBottom: 24, borderBottom: 'none' }}
      >
        <article style={{ whiteSpace: 'pre-line', maxHeight: 400 }}>
          <Header1 align="center">Codex Terms of Use</Header1>
          <Paragraph align="center">
            Updated: <time dateTime="2022-03-03">March 3, 2022</time>
          </Paragraph>
          <Paragraph>
            Welcome to Codex (the &quot;Platform&quot;). This Platform
            is provided by Wild Me (&quot;we&quot; or &quot;us&quot;)
            primarily for use by researchers and conservation
            organizations (&quot;Authorized Users&quot;) through a
            secure login. There are certain site pages that are
            available to the general public (&quot;Other Users&quot;)
            as well as to Authorized Users. &quot;Authorized
            Users&quot; and &quot;Other Users&quot; are collectively
            referred to as &quot;User&quot; or &quot;you&quot; in
            these Website Terms of Use. These Terms of Use
            (&quot;Terms&quot; or &quot;Agreement&quot;) apply to your
            use of the Platform.
          </Paragraph>
          <Paragraph>
            Please read these Terms carefully prior to entering the
            Platform.
          </Paragraph>
          <Paragraph>
            BY ACCESSING OR USING THIS PLATFORM, YOU REPRESENT THAT
            YOU HAVE READ, UNDERSTOOD AND AGREE TO THESE TERMS,
            INCLUDING THEIR DISCLAIMERS AND LIMITATIONS OF LIABILITY.
            YOU ARE GIVING UP SUBSTANTIAL LEGAL RIGHTS BY AGREEING TO
            THESE TERMS. IF YOU DO NOT AGREE TO ANY OF THESE TERMS,
            YOU MAY NOT USE THIS PLATFORM.
          </Paragraph>
          <section>
            <Header2>The Codex Platform</Header2>
            <Paragraph>
              <Definition>Codex</Definition> is a suite of online
              informational services (the &quot;Services&quot;)
              provided by us, consisting of software applications and
              content provided by Wild Me, members of the general
              public, private and public conservation management
              agencies and approved, accredited researchers.
            </Paragraph>
            <section>
              <Header3>Changes or Modifications</Header3>
              <Paragraph>
                We may change, modify, add or remove portions of these
                Terms as well as Platform functionality and the
                Services at any time. Such revised Terms will be
                effective when posted on this Platform. You should
                revisit these Terms on a regular basis, as revised
                versions will be binding upon you. In the event we
                make a material change to these Terms, we may contact
                you via electronic mail, send a notification through
                the Platform built-in system, or post a notice on the
                homepage to let you know of such changes. You
                understand and agree that your continued access to or
                use of this Platform after the effective date of
                changes to these Terms indicates your acceptance of
                such revisions.
              </Paragraph>
            </section>
            <section>
              <Header3>Authorized Users</Header3>
              <Paragraph>
                <Definition>Authorized users</Definition> are those
                persons, and only those persons, who have been issued
                a user identifier (&quot;ID&quot;) and password by an
                authorized user. Once you receive this information,
                you are required to create an account on this Platform
                (your &quot;Account&quot;) and provide your contact
                information. We reserve the right to refuse or reject
                any request to create an account for you for any or no
                reason at our sole discretion.
              </Paragraph>
            </section>
            <section>
              <Header3>Other Users</Header3>
              <Paragraph>
                <Definition>Other users</Definition> are those
                persons, who, without having a user ID or password,
                choose to upload images to the site. Such users,
                regardless if they provide a name or email address,
                are bound by these Terms of Use.
              </Paragraph>
            </section>
          </section>
          <section>
            <Header2>
              Good Faith Data Collection, Reporting, Sharing, and
              Collaboration
            </Header2>
            <Paragraph>
              As a user of the Platform, you have the right to submit
              images, data, and content to the Platform. Any Codex
              Platform is considered a community resource, and its
              content is used by a number of different individuals and
              agencies for a variety of research and conservation
              purposes. In all cases, you will submit User Content
              (defined below) and sighting imagery and information as
              completely and as accurately as possible, obtaining all
              required permissions to use any copyrighted materials
              before submitting them to the Codex platform. Your User
              Content will comply with the conditions of these Terms.
              In addition, you will not submit any content that uses
              language or imagery (verbal or visual) that is deemed as
              offensive by any Wild Me staff for any reason. We
              reserve the right to edit your User Content to enforce
              this.
            </Paragraph>
            <Paragraph>
              All data submitted is available only to Authorized Users
              of the site. Upon suspension or termination of access,
              all User Content continues to exist on the site within
              the limits of these Terms of Use, for the greater good
              of the species and for continued use in conservation and
              research.
            </Paragraph>
            <Paragraph>
              All data contributed by the public and/or authorized
              users continues to be held on the Platform in perpetuity
              for the continued use of authorized researchers and
              conservation organizations.
            </Paragraph>
            <section>
              <Header3>User Content</Header3>
              <Paragraph>
                You may be able to post or upload (in designated areas
                of the Platform) written content, images, or other
                content (collectively{' '}
                <Definition>&quot;User Content&quot;</Definition>) to
                the Platform. You are solely responsible for your own
                User Content and the consequences of posting or
                publishing it. By uploading or posting User Content to
                the Platform, you automatically grant us a worldwide,
                non-exclusive, royalty free, license to use,
                reproduce, modify, create derivative works of,
                translate into different languages or formats, publish
                and republish such User Content on the Platform for
                the purpose of sharing the User Content with Users as
                authorized by you and to promote the Platform. You
                represent and warrant that you own or have the rights
                to use and grant us the license to use the User
                Content in the manner contemplated by the Platform and
                these Terms. This agreement does not transfer any
                other rights or ownership interests in the User
                Content. Upon suspension or termination of access, all
                User Content continues to exist on the site within the
                limits of these Terms of Use, for the greater good of
                the species and for continued use in conservation and
                research.
              </Paragraph>
            </section>
            <section>
              <Header3>Ownership of User Content</Header3>
              <Paragraph>
                Wild Me acts as an independent third party providing
                support software on behalf of the conservation
                research community. As such, Wild Me makes no claim of
                ownership over User Content on any of the Codex
                Platforms. Wild Me will not use content for marketing
                or research efforts without express written permission
                from the appropriate Authorized User; if content is
                not owned by an Authorized User (such as Public
                content or content belonging to a removed user), it is
                considered available for use.
              </Paragraph>
              <Paragraph>
                We do not have, and do not undertake, any obligation
                to prescreen, monitor, edit, or remove any User
                Content posted on or through the Platform or Services.
                However, we retain the right (but not the obligation),
                in our sole discretion and for any reason, to
                prescreen, monitor, edit, remove, or move User Content
                posted on or through the Platform or Services. You
                acknowledge and agree that we are not obligated to
                post, keep, or use your User Content and any revisions
                thereof that may occur from time to time.
              </Paragraph>
              <Paragraph>
                Wild Me reserves the right to use all data on a given
                Platform to update existing or generate new machine
                learning models. If models are generated as part of
                novel research, any publications that come from the
                research may make reference to the parameters
                leveraged to select appropriate data; the data itself
                will not be made available.
              </Paragraph>
            </section>
            <section>
              <Header3>Ownership of Website Content</Header3>
              <Typography>
                As between you and us, we own all intellectual
                property rights, including without limitation
                copyright and trade-mark rights, in all materials on
                or comprising the Platform (
                <Definition>&quot;Content&quot;</Definition>),
                including, without limitation, all written, audio
                visual or other materials and graphical elements on
                the Platform, but excluding User Content. We grant you
                a limited license to use, download, print, or
                reproduce in whole or in part, the Content on this
                Platform, subject to the following conditions:
              </Typography>
              <ul>
                <ListItem>
                  they must be used or reproduced accurately, without
                  any modification;
                </ListItem>
                <ListItem>
                  they must identify the appropriate Codex Platform as
                  the source;
                </ListItem>
                <ListItem>
                  they must be used solely for non-commercial
                  purposes; and
                </ListItem>
                <ListItem>
                  a copyright notice must appear on every copy in the
                  following form:
                  <i
                    style={{
                      display: 'inline-block',
                      fontStyle: 'normal',
                    }}
                  >
                    &quot;&copy; [year] [platform name], Wild Me
                    Codex. All rights reserved&quot;.
                  </i>
                </ListItem>
              </ul>
              <Paragraph>
                Our express, prior, written permission is required to
                use any Content that is not included in the license
                above, such as any graphical elements or website code
                not covered by the GPL v2 license, and/or for the use
                of Content for any purpose not expressly permitted
                above, such as for any commercial purpose whatsoever.
              </Paragraph>
              <Paragraph>
                Codex software is distributed under the GPL v2 license
                and is intended to support mark recapture field
                studies and other research efforts focused on animal
                conservation.
              </Paragraph>
              <Paragraph>
                The Wild Me logos are our trademarks, and may not be
                used without our express written permission.
              </Paragraph>
            </section>
            <section>
              <Header3>Downloading Materials</Header3>
              <Paragraph>
                Except as an Authorized User and for the express
                purpose of research and conservation of these species
                only you may not publish, copy, automatically browse
                or download, display, distribute, post, transmit,
                perform, modify, create derivative works from or sell
                any materials that you did not personally submit,
                information, products or services obtained from the
                Services in any form or by any means, including,
                without limitation, electronic, mechanical,
                photocopying, recording or otherwise, except as
                expressly permitted under applicable law or as
                described in these Terms. Except as an Authorized User
                and for the express purpose of research and
                conservation of these species, you also may not engage
                in systematic retrieval of data or other content or
                materials from the Services to create or compile,
                directly or indirectly, a collection, compilation,
                database or directory, other than with the express,
                written preapproval of Wild Me. Nor may you
                &quot;mirror&quot; on your own site or any other
                server any material contained on the Services,
                including, without limitation, the Services&apos; home
                page or result pages without the express and written
                consent of Wild Me. Use of the Content and materials
                on the Services for any purpose not expressly
                permitted by these Terms is prohibited.
              </Paragraph>
            </section>
            <section>
              <Header3>Third-Party Websites</Header3>
              <Paragraph>
                The Website may contain links to third party websites
                that are not owned or controlled by us. The links to
                the third-party websites are provided for your
                convenience, and the inclusion of the links does not
                imply approval or endorsement of the third-party
                websites by us. We have no control over, and assume no
                responsibility for, the content, privacy policies, or
                practices of any third-party websites.
              </Paragraph>
            </section>
          </section>
          <section>
            <Header2>Account and Security</Header2>
            <Paragraph>
              You are solely responsible for your Account, your
              contact information and other information made available
              through your Account or otherwise via this Platform (
              <Definition>your &quot;Information&quot;</Definition>).
              You assume all risks associated with your Information,
              including reliance on its quality, accuracy or
              reliability by any other person or entity. You must
              notify Wild Me immediately of any breach of security or
              unauthorized use of your user account. Although Wild Me
              will not be liable for your losses caused by any
              unauthorized use of your user account, you may be liable
              for the losses of Wild Me or others due to such
              unauthorized use.
            </Paragraph>
            <section>
              <Header3>
                Code of Conduct for Using Platform and Services
              </Header3>
              <ol type="a">
                <ListItem>
                  You may not use the Platform for any illegal or
                  unauthorized purpose. You agree to comply with all
                  laws that apply to your use of the Platform.
                </ListItem>
                <ListItem>
                  You may not use the Platform in any manner which
                  could disable, overburden, damage, or impair the
                  Platform, our servers or computer network, or
                  interfere with any other party&apos;s use and
                  enjoyment of the Platform.
                </ListItem>
                <ListItem>
                  You agree that you are responsible for your own
                  conduct and communications while using the Platform
                  and for any consequences of that use. By way of
                  example, and not as a limitation, you agree that
                  when using the Platform, you will not:
                  <ul style={{ listStyleType: 'disc' }}>
                    <ListItem>
                      post or upload any inappropriate, promotional,
                      defamatory, destructive, obscene, or unlawful
                      content;
                    </ListItem>
                    <ListItem>
                      defame, abuse, harass, stalk, threaten or
                      otherwise violate the legal rights (such as
                      rights of privacy and publicity) of others;
                    </ListItem>
                    <ListItem>
                      post or upload any User Content that infringes
                      any patent, trademark, copyright, trade secret
                      or other intellectual property right of any
                      party;
                    </ListItem>
                    <ListItem>
                      impersonate another person, or falsify or delete
                      any author attributions, legal or other proper
                      notices or proprietary designations or labels of
                      the origin or source of any content;
                    </ListItem>
                    <ListItem>
                      use the Platform in connection with surveys,
                      contests, junk email, spamming or any
                      duplicative messages (commercial or otherwise);
                    </ListItem>
                    <ListItem>
                      use any robot, spider, site search/retrieval
                      application, or other device to retrieve or
                      index any portion of the Platform to collect
                      information about other users;
                    </ListItem>
                    <ListItem>
                      upload files that contain bugs, viruses, trojan
                      horses, worms, or any other similar software or
                      programs that may damage the operation of the
                      computer or property of another; or
                    </ListItem>
                    <ListItem>
                      submit User Content that falsely expresses or
                      implies that such User Content is sponsored or
                      endorsed by any party where it is not sponsored
                      or endorsed by such party.
                    </ListItem>
                  </ul>
                </ListItem>
                <ListItem>
                  While we prohibit the foregoing conduct and User
                  Content in connection with the Platform, you
                  understand and agree that nonetheless you may be
                  exposed to such conduct or User Content and that you
                  use the Platform at your own risk.
                </ListItem>
              </ol>
            </section>
            <section>
              <Header3>Privacy</Header3>
              <Paragraph>
                By accessing and/or using the Platform, you may
                provide us with{' '}
                <Definition>personal information</Definition>, meaning
                any information that could identify you, such as your
                name, your mailing address, your email address, your
                location and your IP address. &quot;Personal
                information&quot; is a synonym for &quot;personal
                data&quot; within the meaning of the Regulation
                2016/679 of European Union (General Data Protection
                Regulation).
              </Paragraph>
              <Paragraph>
                We collect the following personal information: Last
                name, First name, and Email address.
              </Paragraph>
              <Paragraph>
                Your personal information is collected through both
                website account registration and image submission.
                Image submission can be performed anonymously, but
                will not be attributed to your account as an
                Authorized User.
              </Paragraph>
              <Typography>
                We use the collected data for the following purposes:
              </Typography>
              <ul>
                <ListItem>Platform statistics and analysis</ListItem>
                <ListItem>User Contact</ListItem>
                <ListItem>Managing the Platform</ListItem>
                <ListItem>
                  Associating data with its{' '}
                  <Definition>original observers</Definition>, defined
                  as one or more individuals responsible for
                  submitting the data and/or one or more individuals
                  responsible for collecting related media
                  (photographs, video, etc.), for future validation
                </ListItem>
                <ListItem>
                  Confirming via email the stored link to the
                  observers&apos; submitted data
                </ListItem>
                <ListItem>
                  Notifying the observers of curation events on the
                  data
                </ListItem>
                <ListItem>Providing news updates via email</ListItem>
              </ul>
              <Paragraph>
                The personal data gathered is not transmitted to any
                third party website. If any analysis is performed and
                presented externally, data will only be presented in
                aggregate to prevent individual identification.
              </Paragraph>
              <section>
                <Header4>Cookies</Header4>
                <Paragraph>
                  The cookie files used by the Platform are: Day and
                  time of connection, and LOG: Username, login time
                </Paragraph>
                <Paragraph>
                  You have the right to object to the recording of
                  these cookies and log files by configuring your web
                  browser. Once you have deactivated cookies and log
                  files, you may continue your use of the Platform.
                  However, any malfunction resulting from this
                  deactivation may not be considered of our making.
                </Paragraph>
              </section>
              <section>
                <Header4>Controller</Header4>
                <Paragraph>
                  The Controller oversees determining the purposes for
                  which personal information is processed and the
                  means of such processing.
                </Paragraph>
                <Paragraph>
                  The Controller is: Jason Holmberg, Executive
                  Director, Wild Me
                </Paragraph>
                <Paragraph>
                  The Controller is committed to protecting the
                  personal information collected, to not transmit it
                  to third parties without informing you, and to
                  respect the purposes for which personal information
                  was collected. In the event that the integrity,
                  confidentiality or security of your personal
                  information is compromised, the Controller is
                  committed to notify you.
                </Paragraph>
                <Paragraph>You have the right to:</Paragraph>
                <ul>
                  <ListItem>
                    object to the processing of your personal
                    information by the website (&quot;right to
                    object&quot;).
                  </ListItem>
                  <ListItem>
                    request that your personal information does not
                    appear, for example, on a mailing list
                    (&quot;right to withdraw&quot;).
                  </ListItem>
                  <ListItem>
                    consult, update, modify or request the removal of
                    information about you.
                  </ListItem>
                  <ListItem>
                    request the removal of a personal account.
                  </ListItem>
                </ul>
                <Paragraph>
                  If you wish to exercise any of the rights listed
                  above, you must submit a request to the Controller.
                  Request to the Controller may be submitted via email
                  at: jason@wildme.org
                </Paragraph>
              </section>
              <section>
                <Header4>Host</Header4>
                <Paragraph>
                  The Platform is hosted by Microsoft Corporation,
                  located at the following address: Microsoft
                  Corporation Dept. 551, Volume Licensing 6100 Neil
                  Road, Suite 210 Reno, Nevada 89511-1137 USA.
                </Paragraph>
                <Paragraph>
                  The host may be contacted at the following phone
                  number: None.
                </Paragraph>
              </section>
              <section>
                <Header4>Applicable Law</Header4>
                <Paragraph>
                  We are committed to respect the legislative
                  provisions as specified in:
                </Paragraph>
                <ul>
                  <ListItem>
                    Personal Information Protection and Electronic
                    Documents Act, SC 2000, c 5; and/or
                  </ListItem>
                  <ListItem>
                    Act Respecting the Protection of Personal
                    Information in the Private Sector, CQLR cP-39.1 ;
                    and
                  </ListItem>
                  <ListItem>
                    General Data Protection Regulation, Regulation
                    (EU) 2016/679 of the European Parliament and the
                    Council of{' '}
                    <time dateTime="2016-04-27">27 April 2016</time>{' '}
                    on the protection of natural persons about the
                    processing of personal data and on the free
                    movement of such data, and repealing Directive
                    95/46/EC
                  </ListItem>
                </ul>
              </section>
            </section>
            <section>
              <Header3>Termination</Header3>
              <Paragraph>
                Your rights and privileges under this Agreement will
                terminate automatically and without need for written
                notice upon any breach by you of any term of this
                Agreement, in which event you shall immediately cease
                any access to, or use of, the website, database
                platform, and content (other than content contributed
                by you). Wild Me may also terminate this Agreement for
                any or no reason upon{' '}
                <time dateTime="P30D">thirty (30) days</time> advance
                notice to you. Notwithstanding the foregoing, Wild
                Me&apos;s rights and privileges under these Terms of
                Use will under all circumstances survive any
                termination of this Agreement.
              </Paragraph>
            </section>
          </section>
          <section>
            <Header2>Disclaimer</Header2>
            <Paragraph>
              YOUR USE OF THE PLATFORM, SERVICES AND CONTENT IS
              ENTIRELY AT YOUR OWN RISK. THE PLATFORM, SERVICES AND
              CONTENT IS PROVIDED &quot;AS IS&quot; AND WITHOUT
              WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESSED
              OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF
              MERCHANTABILITY, MERCHANTABLE QUALITY, FITNESS FOR A
              PARTICULAR PURPOSE, TITLE, OR NON-INFRINGEMENT. WILD ME
              DOES NOT WARRANT THAT THE PLATFORM, SERVICES OR CONTENT
              WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL
              BE CORRECTED, OR THAT THIS PLATFORM OR THE SERVER THAT
              MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL
              COMPONENTS.
            </Paragraph>
            <Paragraph>
              WITHOUT LIMITING THE FOREGOING, WE DO NOT WARRANT OR
              MAKE ANY REPRESENTATION REGARDING USE, THE ABILITY TO
              USE, OR THE RESULT OF USE OF THE CONTENT IN TERMS OF
              ACCURACY, RELIABILITY, OR OTHERWISE. THE CONTENT MAY
              INCLUDE TECHNICAL INACCURACIES OR TYPOGRAPHICAL ERRORS.
              WE MAY MAKE CHANGES OR IMPROVEMENTS TO THE CONTENT OR
              THE PLATFORM AT ANY TIME. WE MAKE NO WARRANTIES THAT
              YOUR USE OF THE CONTENT WILL NOT INFRINGE THE RIGHTS OF
              OTHERS AND WE ASSUME NO LIABILITY OR RESPONSIBILITY FOR
              ERRORS OR OMISSIONS IN SUCH CONTENT.
            </Paragraph>
          </section>
          <section>
            <Header2>Limitation of Liability</Header2>
            <Paragraph>
              WE, INCLUDING OUR EMPLOYEES, AGENTS, OFFICERS AND
              DIRECTORS, WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT,
              INCIDENTAL, PUNITIVE, CONSEQUENTIAL, SPECIAL, EXEMPLARY,
              OR OTHER DAMAGES, INCLUDING, WITHOUT LIMITATION, LOSS OF
              REVENUE OR INCOME, PAIN AND SUFFERING, EMOTIONAL
              DISTRESS, OR SIMILAR DAMAGES, OR DAMAGES RESULTING FROM
              ANY (I) ERRORS OR OMISSIONS IN CONTENT, (II) ANY
              UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS AND/OR ANY
              AND ALL PERSONAL INFORMATION AND/OR FINANCIAL
              INFORMATION STORED THEREIN, (III) ANY INTERRUPTION OR
              CESSATION OF TRANSMISSION TO OR FROM OUR WEB PLATFORM,
              (IV) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE,
              WHICH MAY BE TRANSMITTED TO OR THROUGH OUR WEB PLATFORM
              BY ANY THIRD PARTY, OR (V) FOR ANY LOSS OR DAMAGE OF ANY
              KIND INCURRED AS A RESULT OF YOUR USE OF ANY CONTENT
              POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE
              AVAILABLE VIA THE WEB PLATFORM. THIS LIMITATION OF
              LIABILITY APPLIES REGARDLESS OF THE LEGAL THEORY GIVING
              RISE TO THE DAMAGES, AND EVEN IF WILD ME HAS BEEN
              ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THE
              FOREGOING LIMITATION OF LIABILITY SHALL APPLY TO THE
              FULLEST EXTENT PERMITTED BY LAW IN THE APPLICABLE
              JURISDICTION.
            </Paragraph>
            <Paragraph>
              YOU SPECIFICALLY ACKNOWLEDGE THAT WE, AND OUR EMPLOYEES,
              AGENTS, OFFICERS AND DIRECTORS SHALL NOT BE LIABLE FOR
              USER CONTENT OR THE DEFAMATORY, OFFENSIVE, OR ILLEGAL
              CONDUCT OF ANY THIRD PARTY AND THAT THE RISK OF HARM OR
              DAMAGE FROM THE FOREGOING RESTS ENTIRELY WITH YOU.
            </Paragraph>
          </section>
          <section>
            <Header2>Indemnification</Header2>
            <Paragraph>
              You agree to defend, indemnify and hold harmless, us,
              our employees, agents, officers and directors, from and
              against any and all claims, damages, obligations,
              judgments, losses, liabilities, costs, attorneys fees,
              and other expenses arising from or related to (1) your
              use of and access to the Platform, Services and Content;
              (2) your violation of any third party right, including
              without limitation, any copyright, property or privacy
              right; or (3) any claim that you did not have the right
              to provide any User Content or that your User Content
              caused damage to a third party. Your indemnification
              obligation will service these Terms and your use of the
              Platform or Services. In the event of any such claim, we
              will provide you with written notice thereof.
            </Paragraph>
          </section>
          <section>
            <Header2>Jurisdiction</Header2>
            <Paragraph>
              These Terms will be governed by and construed in
              accordance with the laws of Oregon, USA without giving
              effect to its conflict of laws provisions. You agree to
              submit to the personal and exclusive jurisdiction of the
              courts located in Oregon, USA. The Platform is
              physically maintained in and from the State of Oregon,
              USA.
            </Paragraph>
          </section>
          <section>
            <Header2>Assignment</Header2>
            <Paragraph>
              You may not assign any rights you receive or delegate
              any obligations you have under these Terms, in whole or
              in part, whether voluntarily or by operation of law,
              without our prior written consent.
            </Paragraph>
          </section>
          <section>
            <Header2>Entire Agreement</Header2>
            <Paragraph>
              These Terms constitute the entire agreement between you
              and us with respect to the subject matter hereof, and
              these Terms supersede and replace all prior or
              contemporaneous understandings or agreements, written or
              oral, regarding such subject matter.
            </Paragraph>
          </section>
          <section>
            <Header2>Severability</Header2>
            <Paragraph>
              If for any reason a court of competent jurisdiction
              finds any provision or portion of the Terms to be
              unenforceable, the remaining provisions of the Terms
              will continue in full force and effect.
            </Paragraph>
          </section>
          <section>
            <Header2>Questions</Header2>
            <Paragraph>
              If you have any questions, please email us at:
              info@wildme.org.
            </Paragraph>
          </section>
        </article>
      </DialogContent>
    </StandardDialog>
  );
}
