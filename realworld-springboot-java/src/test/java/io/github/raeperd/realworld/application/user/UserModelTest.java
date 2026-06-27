package io.github.raeperd.realworld.application.user;

import io.github.raeperd.realworld.domain.user.Email;
import io.github.raeperd.realworld.domain.user.Image;
import io.github.raeperd.realworld.domain.user.User;
import io.github.raeperd.realworld.domain.user.UserName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

class UserModelTest {

    @Test
    void when_user_has_bio_and_image_expect_fromUserAndToken_preserve_values() {
        final var user = mock(User.class);
        given(user.getEmail()).willReturn(new Email("user@email.com"));
        given(user.getName()).willReturn(new UserName("username"));
        given(user.getBio()).willReturn("sample-bio");
        given(user.getImage()).willReturn(new Image("https://example.com/image.png"));

        final var model = UserModel.fromUserAndToken(user, "token");

        assertThat(model)
                .extracting(
                        UserModel::getEmail,
                        UserModel::getUsername,
                        UserModel::getToken,
                        UserModel::getBio,
                        UserModel::getImage)
                .containsExactly(
                        "user@email.com",
                        "username",
                        "token",
                        "sample-bio",
                        "https://example.com/image.png");
    }

    @Test
    void when_user_has_null_bio_and_image_expect_fromUserAndToken_use_empty_strings() {
        final var user = mock(User.class);
        given(user.getEmail()).willReturn(new Email("user@email.com"));
        given(user.getName()).willReturn(new UserName("username"));
        given(user.getBio()).willReturn(null);
        given(user.getImage()).willReturn(null);

        final var model = UserModel.fromUserAndToken(user, "token");

        assertThat(model)
                .extracting(UserModel::getBio, UserModel::getImage)
                .containsExactly("", "");
    }
}
