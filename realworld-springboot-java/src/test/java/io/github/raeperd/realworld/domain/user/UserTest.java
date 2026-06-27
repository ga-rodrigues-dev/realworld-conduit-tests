package io.github.raeperd.realworld.domain.user;

import io.github.raeperd.realworld.domain.article.Article;
import io.github.raeperd.realworld.domain.article.ArticleContents;
import io.github.raeperd.realworld.domain.article.ArticleUpdateRequest;
import io.github.raeperd.realworld.domain.article.comment.Comment;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserName userNameMock;
    @Mock
    private UserName followedUserNameMock;

    @Mock
    private Password passwordMock;

    private final Email email = new Email("user@email.com");
    private final Email sameEmail = new Email("user@email.com");
    private final Email differentEmail = new Email("user2@email.com");

    @Mock
    private Password followedPasswordMock;

    @Mock
    private Article articleMock;

    @Mock
    private ArticleContents articleContentsMock;

    @Mock
    private ArticleUpdateRequest articleUpdateReqMock;

    @Test
    void when_create_user_getImage_return_null() {
        final var user = User.of(email, userNameMock, passwordMock);

        assertThat(user.getImage()).isNull();
    }

    @Test
    void when_create_user_getBio_return_null() {
        final var user = User.of(email, userNameMock, passwordMock);

        assertThat(user.getBio()).isNull();
    }

    @Test
    void when_user_have_same_email_expect_equal_and_hashCode(@Mock UserName otherName, @Mock Password otherPassword) {
        final var user = User.of(email, userNameMock, passwordMock);
        final var userWithSameEmail = User.of(sameEmail, otherName, otherPassword);

        assertThat(userWithSameEmail)
                .isEqualTo(user)
                .hasSameHashCodeAs(user);
    }

    @Test
    void when_user_have_different_email_expect_not_equal() {
        final var user = User.of(email, userNameMock, passwordMock);
        final var userWithDifferentEmail = User.of(differentEmail, userNameMock, passwordMock);

        assertThat(userWithDifferentEmail)
                .isNotEqualTo(user);
    }

    @Test
    void when_equals_at_null_expect_false() {
        final var user = User.of(email, userNameMock, passwordMock);

        assertThat(user).isNotEqualTo(null);
    }

    @Test
    void when_equals_at_different_class_obj_expect_false() {
        final var anEmail = new Email("user@email.com");
        final var user = User.of(anEmail, userNameMock, passwordMock);
        assertThat(user).isNotEqualTo("user@email.com");
    }

    @Test
    void when_equals_same_reference_expect_true() {
        final var user = User.of(email, userNameMock, passwordMock);
        assertThat(user).isEqualTo(user).hasSameHashCodeAs(user);
    }


    @Test
    void when_view_profile_not_following_user_expect_following_false() {
        final var user = User.of(email, userNameMock, passwordMock);
        final var otherUser = User.of(differentEmail, userNameMock, passwordMock);

        assertThat(user.viewProfile(otherUser))
                .hasFieldOrPropertyWithValue("following", false);
    }

    @Test
    void when_matches_password_expect_password_matches_password() {
        final var user = User.of(email, userNameMock, passwordMock);

        user.matchesPassword("some-password", passwordEncoder);
        verify(passwordMock, times(1)).matchesPassword("some-password", passwordEncoder);
    }

    @Test
    void when_changeEmail_expect_getEmail_return_new_email() {
        final var user = User.of(email, userNameMock, passwordMock);

        user.changeEmail(differentEmail);
        assertThat(user.getEmail()).isEqualTo(differentEmail);
    }

    @Test
    void when_changePassword_expect_matchesPassword_matches_new_password(@Mock Password passwordToChange) {
        final var user = User.of(email, userNameMock, passwordMock);

        user.changePassword(passwordToChange);
        user.matchesPassword("some-password", passwordEncoder);
        verify(passwordToChange, times(1)).matchesPassword("some-password", passwordEncoder);
    }

    @Test
    void when_changeName_expect_getName_return_new_name(@Mock UserName userNameToChange) {
        final var user = User.of(email, userNameMock, passwordMock);

        user.changeName(userNameToChange);
        assertThat(user.getName()).isEqualTo(userNameToChange);
    }

    @Test
    void when_changeBio_expect_getBio_return_new_bio() {
        final var user = User.of(email, userNameMock, passwordMock);

        user.changeBio("new bio");
        assertThat(user.getBio()).isEqualTo("new bio");
    }

    @Test
    void when_changeImage_expect_getImage_return_new_image(@Mock Image imageToChange) {
        final var user = User.of(email, userNameMock, passwordMock);

        user.changeImage(imageToChange);
        assertThat(user.getImage()).isEqualTo(imageToChange);
    }

    @Test
    void when_follows_expect_viewProfile_followingUser_following_true() {
        final var user = User.of(email, userNameMock, passwordMock);
        final var followedUser = User.of(differentEmail, followedUserNameMock, followedPasswordMock);

        user.followUser(followedUser);

        assertThat(user.viewProfile(followedUser))
                .hasFieldOrPropertyWithValue("following", true);
    }

    @Test
    void when_unfollows_expect_viewProfile_followingUser_following_false() {
        final var user = User.of(email, userNameMock, passwordMock);
        final var followedUser = User.of(differentEmail, followedUserNameMock, followedPasswordMock);

        user.followUser(followedUser);
        user.unfollowUser(followedUser);

        assertThat(user.viewProfile(followedUser))
                .hasFieldOrPropertyWithValue("following", false);
    }

    @Test
    void when_viewComment_expect_same_comment_instance_returned() {
        final var viewer = User.of(email, userNameMock, passwordMock);
        final var author = User.of(differentEmail, followedUserNameMock, followedPasswordMock);
        final var comment = new Comment(articleMock, author, "body");

        assertThat(viewer.viewComment(comment)).isSameAs(comment);
    }

    @Test
    void when_viewer_does_not_follow_author_expect_viewComment_sets_following_false() {
        final var viewer = User.of(email, userNameMock, passwordMock);
        final var author = User.of(differentEmail, followedUserNameMock, followedPasswordMock);
        final var comment = new Comment(articleMock, author, "body");

        viewer.viewComment(comment);

        assertThat(comment.getAuthor().getProfile())
                .hasFieldOrPropertyWithValue("following", false);
    }

    @Test
    void when_viewer_follows_author_expect_viewComment_sets_following_true() {
        final var viewer = User.of(email, userNameMock, passwordMock);
        final var author = User.of(differentEmail, followedUserNameMock, followedPasswordMock);
        final var comment = new Comment(articleMock, author, "body");

        viewer.followUser(author);
        viewer.viewComment(comment);

        assertThat(comment.getAuthor().getProfile())
                .hasFieldOrPropertyWithValue("following", true);
    }

    @Test
    void when_user_updates_other_user_article_expect_error() {
        final var viewer = User.of(email, userNameMock, passwordMock);
        final var author = User.of(differentEmail, followedUserNameMock, followedPasswordMock);
        final var article = spy(new Article(author, articleContentsMock));

        assertThatThrownBy(() -> {viewer.updateArticle(article, articleUpdateReqMock);}).isInstanceOf(IllegalAccessError.class);
        verify(article, never()).updateArticle(any());
    }

    @Test
    void when_user_updates_own_article_expect_article_updated() {
        final var user = User.of(email, userNameMock, passwordMock);
        final var article = spy(new Article(user, articleContentsMock));
        final var result = user.updateArticle(article, articleUpdateReqMock);
        assertSame(result, article);
        verify(article).updateArticle(articleUpdateReqMock);

    }



}
