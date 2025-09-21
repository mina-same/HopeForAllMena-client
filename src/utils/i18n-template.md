# i18n Page Template

## Quick Setup for New Pages

To add translation support to any page, add these two parts:

### 1. Import GraphQL at the top:
```javascript
import { graphql } from "gatsby";
```

### 2. Add this query at the bottom of your page file:
```javascript
export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
```

## Complete Example:
```javascript
import React from "react";
import { graphql } from "gatsby";  // <- Add this import
import Layout from "../components/layout";

const MyPage = () => {
  return (
    <Layout pageTitle="My Page">
      {/* Your page content */}
    </Layout>
  );
};

export default MyPage;

// <- Add this query at the end
export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
```

## Why This Approach?

Unfortunately, Gatsby requires the GraphQL query to be directly exported from each page file. It cannot be imported from another file due to how Gatsby's build system works. This is a limitation of Gatsby, not our implementation.

## VS Code Snippet (Optional)

You can create a VS Code snippet to make this faster:

1. Go to File > Preferences > Configure User Snippets
2. Select "javascript" or "javascriptreact"
3. Add this snippet:

```json
{
  "i18n Page Query": {
    "prefix": "i18nquery",
    "body": [
      "export const query = graphql`",
      "  query ($language: String!) {",
      "    locales: allLocale(filter: { language: { eq: $language } }) {",
      "      edges {",
      "        node {",
      "          ns",
      "          data",
      "          language",
      "        }",
      "      }",
      "    }",
      "  }",
      "`;"
    ],
    "description": "Add i18n GraphQL query to page"
  }
}
```

Then just type `i18nquery` and press Tab to insert the query!
