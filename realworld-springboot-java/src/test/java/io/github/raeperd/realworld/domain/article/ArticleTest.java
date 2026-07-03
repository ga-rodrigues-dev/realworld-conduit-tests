package io.github.raeperd.realworld.domain.article;

import io.github.raeperd.realworld.domain.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArticleTest {

    @Mock
    private ArticleContents contents;
    @Mock
    private ArticleTitle title;
    @Mock
    private User author;

    @Test
    void when_article_has_different_author_expect_not_equal_and_hashCode(@Mock User otherUser) {
        when(contents.getTitle()).thenReturn(title);

        var article = new Article(author, contents);
        var articleFromOtherUser = new Article(otherUser, contents);

        assertThat(articleFromOtherUser)
                .isNotEqualTo(article)
                .extracting(Article::hashCode)
                .isNotEqualTo(article.hashCode());
    }

    @Test
    void when_article_has_different_contents_expect_not_equal_and_hashCode(@Mock ArticleContents otherContents, @Mock ArticleTitle otherTitle) {
        when(contents.getTitle()).thenReturn(title);
        when(otherContents.getTitle()).thenReturn(otherTitle);

        var article = new Article(author, contents);
        var articleWithOtherContents = new Article(author, otherContents);

        assertThat(articleWithOtherContents)
                .isNotEqualTo(article)
                .extracting(Article::hashCode)
                .isNotEqualTo(article.hashCode());
    }

    @Test
    void when_article_has_same_author_and_title_expect_equal_and_hashCode() {
        when(contents.getTitle()).thenReturn(title);

        var article = new Article(author, contents);
        var articleWithSameAuthorSlug = new Article(author, contents);

        assertThat(articleWithSameAuthorSlug)
                .isEqualTo(article)
                .hasSameHashCodeAs(article);
    }

    @Test
    void when_article_is_compared_with_different_type_expect_not_equal() {
        var article = new Article(author, contents);
        var otherType = new Object();
        assertThat(article).isNotEqualTo(otherType);
    }

    @Test
    void when_article_is_compared_with_null_expect_not_equal() {
        var article = new Article(author, contents);
        assertThat(article).isNotEqualTo(null);
    }

    @Test
    void when_article_equals_same_reference_expect_true() {
        when(contents.getTitle()).thenReturn(title);
        var article = new Article(author, contents);
        assertThat(article).isEqualTo(article).hasSameHashCodeAs(article);
    }

//    @Test
//    void when_article_author_deletes_article_comment_from_other_user_expect_success(@Mock User otherUser) throws NoSuchFieldException, IllegalAccessException {
//        var article = new Article(author, contents);
//        var comment = article.addComment(otherUser, "comment");
//
//        var idField = comment.getClass().getDeclaredField("id");
//        idField.setAccessible(true);
//        idField.set(comment, 1L);
//
//        article.removeCommentByUser(author, comment.getId());
//        assertThat(article.getComments()).isEmpty();
//    }

    @Test
    void when_article_author_deletes_own_comment_expect_success() throws NoSuchFieldException, IllegalAccessException {
        var article = new Article(author, contents);
        var comment = article.addComment(author, "comment");

        var idField = comment.getClass().getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(comment, 1L);

        article.removeCommentByUser(author, comment.getId());
        assertThat(article.getComments()).isEmpty();
    }

    @Test
    void when_article_author_deletes_comment_from_other_user_expect_failure(@Mock User otherUser) throws NoSuchFieldException, IllegalAccessException {
        var article = new Article(author, contents);
        var comment = article.addComment(otherUser, "comment");

        var idField = comment.getClass().getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(comment, 1L);

        assertThrows(IllegalAccessError.class, () -> {
            article.removeCommentByUser(author, comment.getId());
        });
    }

    @Test
    void when_non_author_deletes_own_comment_expect_failure(@Mock User otherUser) throws NoSuchFieldException, IllegalAccessException {
        var article = new Article(author, contents);
        var comment = article.addComment(otherUser, "comment");

        var idField = comment.getClass().getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(comment, 1L);

        assertThrows(IllegalAccessError.class, () -> {
            article.removeCommentByUser(otherUser, comment.getId());
        });
    }

    @Test
    void when_non_author_deletes_other_user_comment_expect_failure(@Mock User otherUser, @Mock User anotherUser) throws NoSuchFieldException, IllegalAccessException {
        var article = new Article(author, contents);
        var comment = article.addComment(otherUser, "comment");

        var idField = comment.getClass().getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(comment, 1L);

        assertThrows(IllegalAccessError.class, () -> {
            article.removeCommentByUser(anotherUser, comment.getId());
        });
    }



    @Test
    void when_delete_comment_that_cant_be_found_expect_NoSuchElementException() {
        var article = new Article(author, contents);
        assertThrows(NoSuchElementException.class, () -> {
            article.removeCommentByUser(author, 1L);
            });
        }
    }


