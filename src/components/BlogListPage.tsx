import React from 'react';
import Translate from '@docusaurus/Translate';
import BlogLayout from '@theme/BlogLayout';
import BlogListPage, {type Props} from '@theme/BlogListPage';

export default function BlogListPageWithEmptyState(props: Props) {
  if (props.metadata.totalCount > 0) {
    return <BlogListPage {...props} />;
  }

  const {blogTitle, blogDescription} = props.metadata;
  return (
    <BlogLayout title={blogTitle} description={blogDescription}>
      <h1>{blogTitle}</h1>
      <p>
        <Translate id="blog.empty">Aucun article pour le moment.</Translate>
      </p>
    </BlogLayout>
  );
}
