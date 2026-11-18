import Translate from '@docusaurus/Translate';
import {TitleFormatterProvider} from '@docusaurus/theme-common/internal';
import BlogListPage, {type Props} from '@theme/BlogListPage';
import Layout from '@theme/Layout';

export default function BlogList(props: Props) {
  if (props.items.length > 0) {
    return props.metadata.page === 1 ? (
      <TitleFormatterProvider formatter={({siteTitle}) => siteTitle}>
        <BlogListPage {...props} />
      </TitleFormatterProvider>
    ) : <BlogListPage {...props} />;
  }

  const {blogTitle, blogDescription} = props.metadata;
  return (
    <Layout description={blogDescription}>
      <main className="container margin-vert--lg">
        <h1>{blogTitle}</h1>
        <p>
          <Translate id="blog.empty">Aucun article publié pour le moment.</Translate>
        </p>
      </main>
    </Layout>
  );
}
