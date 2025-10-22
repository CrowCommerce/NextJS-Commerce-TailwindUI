export const getNavigationQuery = /* GraphQL */ `
  query getNavigation {
    navigationCategories: metaobjects(type: "navigation_category", first: 10) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
            references(first: 20) {
              edges {
                node {
                  ... on Metaobject {
                    id
                    fields {
                      key
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    navigationPages: metaobject(
      handle: { type: "navigation_pages", handle: "main-pages" }
    ) {
      id
      fields {
        key
        references(first: 10) {
          edges {
            node {
              ... on Metaobject {
                id
                fields {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;
