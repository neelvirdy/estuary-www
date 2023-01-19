import tstyles from '@pages/table.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import { P } from '@root/components/Typography';
import { ContentStatus } from '../deals';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  if (!viewer) {
    return {
      redirect: {
        permanent: false,
        destination: '/sign-in',
      },
    };
  }

  return {
    props: { viewer, ...context.params, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function LocalContentPage(props) {
  const [state, setState] = React.useState({ content: null });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get(`/content/status/${props.id}`, props.api);

      if (response && !response.error) {
        return setState({ ...response });
      }

      alert(`Content ${props.id} not found.`);
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar viewer={props.viewer} />;
  console.log(state.content);

  return (
    <Page title={`Estuary: Content: ID: ${props.id}`} description={`Content status for local ID: ${props.id}`} url={`${props.hostname}/content/${props.id}`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <React.Fragment>
          <table className={tstyles.table}>
            <tbody className={tstyles.tbody}>
              <tr className={tstyles.tr}>
                <th className={tstyles.th}>Local ID</th>
              </tr>

              <tr className={tstyles.tr}>
                <td className={tstyles.td}>{props.id}</td>
              </tr>
            </tbody>
          </table>
          {state.content && state.content.aggregatedIn > 0 ? (
            <div>
              <P>This content is aggregated in the following bucket:</P>
              <ContentStatus host={props.api} viewer={props.viewer} id={state.content.aggregatedIn} key={state.content.aggregatedIn} root={props} />
            </div>
          ) : (
            <ContentStatus host={props.api} viewer={props.viewer} id={props.id} key={props.id} root={props} />
          )}
        </React.Fragment>
      </AuthenticatedLayout>
    </Page>
  );
}

export default LocalContentPage;
